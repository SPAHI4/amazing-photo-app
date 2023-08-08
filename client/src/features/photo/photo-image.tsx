import { Box } from '@mui/material';
import { css, Global } from '@emotion/react';
import { useFragment } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { notEmpty } from '../../utils/array.ts';
import { useBrowserFeatures } from '../../hooks/use-browser-features.ts';
import { graphql } from '../../__generated__/gql.ts';
import { useSafeTimeout } from '../../hooks/use-safe-timeout.ts';

const PHOTO_IMAGE_PHOTO = graphql(`
  fragment PhotoImage_photo on Photo {
    id
    location {
      id
      name
    }
    image {
      s3Bucket
      sources {
        type
        s3Key
        size
      }
    }
    width
    height
    blurhash
  }
`);

interface PhotoImageProps {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
  imgRef: React.Ref<HTMLPictureElement>;
  setFullscreen: (dispatchFn: (val: boolean) => boolean) => void | ((fullscreen: boolean) => void);
}

export function PhotoImage(props: PhotoImageProps) {
  const { imgRef, setFullscreen } = props;
  const theme = useTheme();
  const { data: photo, complete } = useFragment({
    fragment: PHOTO_IMAGE_PHOTO,
    fragmentName: 'PhotoImage_photo',
    from: props.photo,
  });
  const [setSafeTimeout] = useSafeTimeout();
  const features = useBrowserFeatures();

  // with startViewTransition() fps is too low for hdr images even with decoding=async, so we just wait a bit, then load full res
  const [showFull, setShowFull] = useState(false);
  useEffect(() => {
    if (!showFull) {
      setSafeTimeout(() => {
        setShowFull(true);
      }, 700);
    }
  }, [setSafeTimeout, showFull]);

  if (!complete) {
    return null;
  }

  const isPortrait = photo.height > photo.width;
  const VIEW_TRANSITION_NAME = `photo-${photo.id}`;

  const sources = photo.image?.sources.filter(notEmpty) ?? [];

  const avifSrcSet = sources
    .filter((source) => source.type === 'image/avif')
    .filter((source) => [2560, 3840].includes(source.size ?? 0))
    .map((source) => {
      const w = isPortrait
        ? Math.ceil(((source.size ?? 0) * photo.height) / photo.width)
        : source.size;
      return `https://${photo.image?.s3Bucket ?? ''}.s3.amazonaws.com/${source.s3Key} ${w}w`;
    });

  const webpSrcSet = sources
    .filter((source) => source.type === 'image/webp')
    .filter((source) => [2560, 3840].includes(source.size ?? 0))
    .map((source) => {
      const w = isPortrait
        ? Math.ceil(((source.size ?? 0) * photo.height) / photo.width)
        : source.size;
      return `https://${photo.image?.s3Bucket ?? ''}.s3.amazonaws.com/${source.s3Key} ${w}w`;
    });

  // if user is coming from the location page, this image should be cached already
  const src = sources
    .filter((source) =>
      features.avifSupported ? source.type === 'image/avif' : source.type === 'image/webp',
    )
    .find((source) => source.size === (isPortrait ? 1440 : 960));
  const srcUrl = `https://${photo.image?.s3Bucket}.s3.amazonaws.com/${src?.s3Key}`;

  return (
    <>
      <Global
        styles={css`
          ::view-transition-old(${VIEW_TRANSITION_NAME}) {
            animation: none;
            mix-blend-mode: normal;
            animation-timing-function: var(--motion-easin-emphasized-decelerate);
          }
          ::view-transition-new(${VIEW_TRANSITION_NAME}) {
            animation: none;
            mix-blend-mode: normal;
            animation-timing-function: var(--motion-easin-emphasized-accelerate);
          }
        `}
      />
      <Box
        css={css`
          grid-area: photo-image;
          position: relative;
          min-height: 0;
          min-width: 0;
        `}
      >
        <picture
          ref={imgRef}
          onDoubleClick={(event) => {
            event.preventDefault();
            setFullscreen((val: boolean) => !val);
          }}
          css={css`
            &:fullscreen * {
              cursor: initial !important;
            }
          `}
        >
          {features.avifSupported && avifSrcSet.length > 0 && showFull && (
            <source srcSet={avifSrcSet.join(', ')} type="image/avif" />
          )}
          {webpSrcSet.length > 0 && showFull && (
            <source srcSet={webpSrcSet.join(', ')} type="image/webp" />
          )}
          <img
            alt={photo.location?.name ?? ''}
            decoding="sync"
            src={srcUrl}
            css={css`
              view-transition-name: ${VIEW_TRANSITION_NAME};
              image-rendering: high-quality;
              image-rendering: optimizeQuality;
              display: block;
              position: absolute;
              top: 50%;
              left: 50%;
              translate: -50% -50%;

              ${isPortrait &&
              css`
                height: 100%;
                max-width: 100%;
              `}

              ${!isPortrait &&
              css`
                width: 100%;
                max-height: 100%;
              `}

              ${theme.breakpoints.down('md')} {
                display: block;
                position: unset;
                translate: unset;
                width: 100vw;
              }
            `}
          />
        </picture>
      </Box>
    </>
  );
}
