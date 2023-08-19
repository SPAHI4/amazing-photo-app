import { Logger, Task } from 'graphile-worker';
import { PromisePool } from '@supercharge/promise-pool';
import { GetObjectCommand, PutObjectAclCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import exifr from 'exifr';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import * as path from 'node:path';
import { spawn } from 'node:child_process';
import * as os from 'os';
import { env } from '@app/config/env.js';
import { s3 } from '../s3.js';
import { TempFile } from '../fs.js';

const convertTypes = ['image/avif', 'image/webp', 'image/jpeg'] as const;
const convertSizes = [3840, 480, 2560, 960, 1440] as const;

const flatten = <T>(arr: T[][]): T[] => ([] as T[]).concat(...arr);

const spawnAsync = async (command: string, args: string[]): Promise<void> => {
  const process = spawn(command, args);

  await new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data;
    });

    process.stderr.on('data', (data) => {
      stderr += data;
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}: ${stdout} ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
};

interface ConvertSource {
  filePath: string;
  hdr: boolean;
  type: (typeof convertTypes)[number] | string;
}

interface ConvertTarget {
  filePath: string;
  size: (typeof convertSizes)[number];
  type: (typeof convertTypes)[number];
}

interface ConvertResult {
  filePath: string;
  type: (typeof convertTypes)[number];
  size: (typeof convertSizes)[number];
}

export interface ImageSource {
  s3_key: string;
  size: number;
  type: string;
}

const convertImage = async (
  source: ConvertSource,
  target: ConvertTarget,
  logger: Logger,
): Promise<ConvertResult> => {
  const lossless = target.size >= 1920;

  let commandArgs = [
    ['-vf', `scale=${target.size}:-1`],
    ['-c:v', 'libwebp'],
    ['-lossless', lossless ? '1' : '0'],
  ];

  // simple jpeg conversion
  if (target.type === 'image/jpeg') {
    commandArgs = [
      ['-vf', `scale=${target.size}:-1`],
      ['-qscale:v', '80'],
    ];
  }

  // convert to avif with hdr settings
  if (source.hdr && target.type === 'image/avif') {
    commandArgs = [
      ['-colorspace', 'bt2020nc'],
      ['-color_trc', 'smpte2084'],
      ['-color_primaries', 'bt2020'],
      ['-c:v', 'libaom-av1'],
      ['-crf', '8'],
      ['-still-picture', '1'],
      ['-vf', `scale=${target.size}:-1`],
    ];
  }

  // fallback to web with sdr tonemapping
  if (source.hdr && target.type === 'image/webp') {
    commandArgs = [
      [
        '-vf',
        `scale=${target.size}:-2,format=yuv420p,zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`,
      ],
      ['-c:v', 'libwebp'],
      ['-lossless', lossless ? '1' : '0'],
    ];
  }

  const args = ['-y', '-i', source.filePath, ...commandArgs.flat(), target.filePath, '>', '/tmp/conversion.log', '2>&1'];

  logger.debug(`🤓 Converting image: ffmpeg ${args.join(' ')}`);

  await spawnAsync('ffmpeg', args);

  logger.debug(`😎 Image converted => ${target.filePath}`);

  return {
    filePath: target.filePath,
    type: target.type,
    size: target.size,
  };
};

export interface ConvertImagePayload {
  image_id: number;
}

type ExifData = Record<string, string | number | number[]> & { errors: [[string]] };

type DbImage = {
  id: number;
  s3_key: string;
  s3_bucket: string;
  exif_data: ExifData;
};

// @see https://github.com/MikeKovarik/exifr/issues/115
const detectHdr = (contentType: string, exifData: ExifData) =>
  contentType === 'image/avif' &&
  typeof exifData.Software === 'string' &&
  exifData.Software.startsWith('Adobe Photoshop Camera Raw 15');

export const convertImageTask: Task = async (inPayload, { logger, query }) => {
  try {
    const payload = inPayload as ConvertImagePayload;
    const imageId = payload.image_id;

    logger.info(`Converting image: ${imageId}`);

    const {
      rows: [image],
    } = await query<DbImage>(`
        select
            id,
            s3_key,
            s3_bucket,
            exif_data
        from
            app_public.images
        where
            id = $1
        `,
    [imageId],
    );

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (image == null) {
      throw new Error(`Image not found: ${imageId}`);
    }

    const command = new GetObjectCommand({
      Bucket: image.s3_bucket,
      Key: image.s3_key,
    });

    const obj = await s3.send(command);

    if (!(obj.Body instanceof Readable)) {
      throw new Error('Body is not a readable stream');
    }

    if (obj.ContentType == null) {
      throw new Error('Content type is null');
    }

    // eslint-disable-next-line
    await using sourceTmpFile = await TempFile.createWrite();
    const writeStream = sourceTmpFile.handle.createWriteStream();

    await pipeline(obj.Body, writeStream);
    await sourceTmpFile.handle.close();

    const exifData = await exifr.parse(sourceTmpFile.path, {
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      exif: true,
      gps: true,
      interop: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
      sanitize: true,
      mergeOutput: true,
    });

    const isHdr = detectHdr(obj.ContentType, exifData);
    const source = {
      filePath: sourceTmpFile.path,
      hdr: isHdr,
      type: obj.ContentType as string,
    };

    const sourcesToConvert: [ConvertSource, ConvertTarget][] = flatten(
      convertSizes.map((size) => {
        const targetAvif = {
          type: 'image/avif' as const,
          size,
          filePath: path.join(
            os.tmpdir(),
            `${path.basename(image.s3_key, path.extname(image.s3_key))}__${size}px.avif`,
          ),
        };
        const targetWebp = {
          type: 'image/webp' as const,
          size,
          filePath: path.join(
            os.tmpdir(),
            `${path.basename(image.s3_key, path.extname(image.s3_key))}__${size}px.webp`,
          ),
        };

        return [
          [source, targetAvif],
          [source, targetWebp],
        ];
      }),
    );

    // convert 480px webp to jpeg, we need 480 for emails only
    const [, target480Webp] = sourcesToConvert.find(
      ([, target]) => target.type === 'image/webp' && target.size === 480,
    ) as [ConvertSource, ConvertTarget];
    const target480Jpeg = {
      type: 'image/jpeg' as const,
      size: 480 as const,
      filePath: path.join(
        os.tmpdir(),
        `${path.basename(image.s3_key, path.extname(image.s3_key))}__${480}px.jpeg`,
      ),
    };
    const source480Webp = {
      filePath: target480Webp.filePath,
      hdr: false,
      type: 'image/webp' as const,
    };
    sourcesToConvert.push([source480Webp, target480Jpeg]);

    const convertAndUpload = async ([, target]: [
      ConvertSource,
      ConvertTarget,
    ]): Promise<ImageSource> => {
      const { filePath, type, size } = await convertImage(source, target, logger);
      await using tempFile = await TempFile.createRead(filePath);
      const fileStream = tempFile.handle.createReadStream();

      const destKey = path.join(path.dirname(image.s3_key), path.basename(filePath));

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: env.S3_BUCKET_NAME,
          Key: destKey,
          Body: fileStream,
          ContentType: type,
          ACL: 'public-read',
        },
      });

      await upload.done();

      logger.debug(`📤 Image uploaded to s3 => ${destKey}`);

      return {
        size,
        s3_key: destKey,
        type,
      };
    };

    const { results: uploadedImages } = await PromisePool.withConcurrency(1)
      .for(sourcesToConvert)
      .handleError((err) => {
        throw err;
      })
      .process(convertAndUpload);

    await query(
      `
        update
            app_public.images
        set
            sources = array (
                select
                    array_agg(rows)
                from
                    json_populate_recordset(null::app_public.image_source, $1) as rows),
            exif_data = $2,
            is_hdr = $3
        where
            id = $4
        returning
            id
        `,
      [JSON.stringify(uploadedImages), exifData, isHdr, imageId],
    );

    // set ACL to authenticated_read to source image
    const updateAclCommand = new PutObjectAclCommand({
      Bucket: image.s3_bucket,
      Key: image.s3_key,
      ACL: 'authenticated-read',
    });

    await s3.send(updateAclCommand);

    logger.info(`🤌 Image with id ${imageId} converted`);
  } catch (err) {
    logger.error(`🫡 Error resizing image ${err}`);
    throw err;
  }
};
