import { useForm } from 'react-hook-form';
import { encode } from 'blurhash';
import React, { useTransition } from 'react';
import { useMutation } from '@apollo/client';
import exifr from 'exifr';
import { Box, Button, CircularProgress, Skeleton, SvgIcon, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { graphql } from '../../__generated__';
import { ImageInput } from '../../ui-components/image-input.tsx';
import { Transition } from '../../ui-components/transition.tsx';
import { useFetch } from '../../hooks/use-fetch.ts';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { IconUndo } from '../../icons.tsx';
import { RouteUploadFormValues, UploadStep } from './upload-types.ts';

type ExifData = Record<string, string | number | Date> & { errors: [[string]] };

const mapExifToFormValues = (exif: ExifData) => ({
  lat: exif.latitude,
  lng: exif.longitude,
  camera: `${exif.Make} ${exif.Model}`,
  lens: exif.LensModel,
  focalLength: exif.FocalLength,
  iso: exif.ISO,
  aperture: exif.FNumber,
  shutterSpeed: exif.ExposureTime,
  shotAt: exif.DateTimeOriginal,
  width: exif.ImageWidth,
  height: exif.ImageHeight,
});

const getExifValues = async (file: File) => {
  const exif = await exifr.parse(file, {
    tiff: true,
    xmp: true,
    icc: true,
    iptc: true,
    exif: true,
    gps: true,
    interop: true,
    // Other TIFF tags
    makerNote: true,
    userComment: true,
    // Filters
    skip: [],
    pick: [],
    // Formatters
    translateKeys: true,
    translateValues: true,
    reviveValues: true,
    sanitize: true,
    mergeOutput: true,
  });

  console.log({ exif });

  return mapExifToFormValues(exif);
};

const getImageData = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  context!.drawImage(image, 0, 0);
  return context!.getImageData(0, 0, image.width, image.height);
};

const CREATE_IMAGE_UPLOAD_MUTATION = graphql(`
  mutation createImageUpload($input: CreateImageUploadInput!) {
    createImageUpload(input: $input) {
      url
      fields
      image {
        id
      }
    }
  }
`);

const UPDATE_IMAGE_MUTATION = graphql(`
  mutation updateImage($input: UpdateImageInput!) {
    updateImage(input: $input) {
      image {
        id
        isUploaded
      }
    }
  }
`);

const getThumbnail = (image: HTMLImageElement) => {
  const thumbnailWidth = 30;
  const thumbnailHeight = thumbnailWidth * (image.height / image.width);
  const canvas = document.createElement('canvas');
  canvas.width = thumbnailWidth;
  canvas.height = thumbnailHeight;
  canvas
    .getContext('2d')!
    .drawImage(image, 0, 0, image.width, image.height, 0, 0, thumbnailWidth, thumbnailHeight);
  return canvas.toDataURL('image/webp', 0.5);
};

export function UploadCardImage({
  form,
}: {
  form: ReturnType<typeof useForm<RouteUploadFormValues>>;
}) {
  const [uploadImage, { loading: uploadLoading, abort: abortUpload }] = useFetch({}, false);
  const [image, setImage] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [createImageUpload, { loading: createUploadLoading }] = useMutation(
    CREATE_IMAGE_UPLOAD_MUTATION,
  );
  const [updateImage, { loading: completeUploadLoading }] = useMutation(UPDATE_IMAGE_MUTATION);
  const isLoading = uploadLoading || createUploadLoading || completeUploadLoading || isPending;

  const handleImageLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = event.currentTarget;

      const imageData = getImageData(img);

      form.setValue('width', img.naturalWidth);
      form.setValue('height', img.naturalHeight);

      // blurhash
      const hash = encode(imageData.data, imageData.width, imageData.height, 4, 4);
      form.setValue('blurhash', hash);

      form.setValue('thumbnail', getThumbnail(img));
    },
    [form],
  );

  const handleAbort = React.useCallback(() => {
    setImage(null);
    form.reset();
    abortUpload();
  }, [abortUpload, form]);

  const handleImageChange = React.useCallback(
    async (file: File) => {
      setImage(null);
      form.reset();
      startTransition(() => {
        setImage(URL.createObjectURL(file));
      });

      // once image is loaded, we can proceed even before upload is finished
      form.setValue('uploadStep', UploadStep.Info);

      // set exif data
      const exif = await getExifValues(file);
      Object.entries(exif).forEach(([key, value]) => {
        form.setValue(key as keyof ReturnType<typeof mapExifToFormValues>, value);
      });

      try {
        // 1. create image and get signed link
        const { data } = await createImageUpload({
          variables: {
            input: {
              contentType: file.type,
            },
          },
        });

        if (data == null) {
          throw new Error('createImageUpload returned null');
        }

        // 2. upload image to s3
        const formData = new FormData();
        for (const [key, value] of Object.entries(data.createImageUpload.fields)) {
          formData.append(key, value as string);
        }
        formData.append('file', file);

        await uploadImage(data.createImageUpload.url, {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        });

        form.setValue('url', `${data.createImageUpload.url}${data.createImageUpload.fields.key}`);

        // 3. trigger image processing
        await updateImage({
          variables: {
            input: {
              id: data.createImageUpload.image.id,
              patch: {
                isUploaded: true,
              },
            },
          },
        });

        form.setValue('imageId', data.createImageUpload.image.id);
      } catch (error) {
        console.error('Upload failed.', error);
        setImage(null);

        form.reset();
      }
    },
    [updateImage, createImageUpload, form, uploadImage],
  );

  return (
    <div>
      <Box p={3}>
        <Transition transition="fade-slide" delay={100}>
          <Typography variant="subtitle1" gutterBottom={false}>
            First things first...
          </Typography>
        </Transition>
        <Transition transition="fade-slide" delay={800}>
          <Typography variant="h3">Choose your images</Typography>
        </Transition>
      </Box>
      <Box
        py={3}
        gap={1}
        css={css`
          display: grid;
          position: relative;
        `}
      >
        <Transition transition="fade" delay={900}>
          <div
            css={css`
              width: 100%;
              aspect-ratio: 4/3;
              background-color: rgba(0, 0, 0, 0.05);
              transition: all 0.2s ease-in-out;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            {isPending && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                css={css`
                  width: 100%;
                  height: 100%;
                `}
              />
            )}
            {image != null ? (
              <img
                css={css`
                  max-width: 100%;
                  object-fit: contain;
                `}
                decoding="async"
                src={image}
                alt="Preview"
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
            ) : (
              <ImageInput onChange={handleImageChange} />
            )}
          </div>
        </Transition>
        {image != null && (
          <Box
            px={2}
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: sticky;
              bottom: 0;
              backdrop-filter: blur(20px);
            `}
          >
            <CircularProgress css={{ visibility: isLoading ? 'visible' : 'hidden' }} size={20} />
            <StickPointerButton>
              <Button
                onClick={handleAbort}
                startIcon={
                  <SvgIcon>
                    <IconUndo />
                  </SvgIcon>
                }
              >
                Choose another one
              </Button>
            </StickPointerButton>
          </Box>
        )}
      </Box>
    </div>
  );
}
