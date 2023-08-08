import { Task } from 'graphile-worker';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../s3.ts';

// delete image from s3, called by on delete trigger in app_public.images

interface DeleteImagePayload {
  image_id: string;
}

export const deleteImageTask: Task = async (inPayload, { query, logger }) => {
  const payload = inPayload as DeleteImagePayload;

  const imageId = payload.image_id;

  logger.info(`Deleting image: ${imageId}`);

  const {
    rows: [image],
  } = await query(
    `
     select app_public.images.s3_bucket,
            app_public.images.s3_key,
            json_agg(
                    json_build_object('s3_key', (u).s3_key, 'size', (u).size, 'type', (u).type)
                ) AS sources
     from app_public.images, unnest(sources) AS u
     where id = $1
     group by app_public.images.s3_bucket, app_public.images.s3_key
     limit 1
 `,
    [imageId],
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (image == null) {
    throw new Error(`Image not found: ${imageId}`);
  }

  const payloads = [
    {
      Bucket: image.s3_bucket,
      Key: image.s3_key,
    },
    ...image.sources.map((source: { s3_bucket: string; s3_key: string }) => ({
      Bucket: image.s3_bucket,
      Key: source.s3_key,
    })),
  ];

  logger.debug(
    `Deleting ${payloads.length} objects from S3: ${payloads.map((p) => p.Key).join(', ')}`,
  );

  try {
    await Promise.all(
      payloads.map(async (source) => {
        await s3.send(new DeleteObjectCommand(source));
      }),
    );
  } catch (err: unknown) {
    logger.error(`Error deleting image ${imageId}: ${err}`);
    throw err;
  } finally {
    logger.info(`Successfully deleted ${payloads.length} objects from S3`);
  }
};
