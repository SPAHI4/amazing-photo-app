import useTheme from '@mui/material/styles/useTheme';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Box, ImageListItem } from '@mui/material';
import { css, Global } from '@emotion/react';
import { Link } from 'react-router-dom';
import { Blurhash } from 'react-blurhash';
import { useFragment } from '@apollo/client';
import { StickPointerImage } from '../../ui-components/cursor.tsx';
import { viewTransitionPhoto } from '../../utils/view-transitions.ts';
import { useBrowserFeatures } from '../../hooks/use-browser-features.ts';
import { graphql } from '../../__generated__/gql.ts';
import { getSourceSrc, preloadImageLink } from './photo-utils.ts';

const PHOTO_CARD_PHOTO_FRAGMENT = graphql(`
  fragment PhotoCard_photo on Photo {
    id
    width
    height
    blurhash
    thumbnail
    likesCount
    image {
      s3Bucket
      sources {
        type
        s3Key
        size
      }
    }
    comments {
      totalCount
    }
    location {
      id
      slug
    }
  }
`);

type PhotoCardProps = {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
  index: number;
};

function PhotoLabel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <div
      css={css`
        color: ${theme.vars.palette.text.primary};
        display: flex;
        align-items: center;
        backdrop-filter: blur(20px) ${mode === 'dark' ? 'brightness(0.5)' : 'brightness(1.5)'};
        border-radius: 20px;
        padding: 6px 16px;
      `}
    >
      <span
        css={css`
          font-family: ${theme.typography.h1.fontFamily};
          font-size: 2rem;
          font-weight: 800;
        `}
      >
        {children}
      </span>
    </div>
  );
}

export const PhotoCard = memo((props: PhotoCardProps) => {
  const { index } = props;
  const { data: photo, complete } = useFragment({
    fragment: PHOTO_CARD_PHOTO_FRAGMENT,
    fragmentName: 'PhotoCard_photo',
    from: props.photo,
  });
  const features = useBrowserFeatures();
  const [hovered, setHovered] = useState(false);
  const preloadRef = useRef<HTMLLinkElement | null>(null);
  const handleMouseEnter = useCallback(() => {
    setHovered(true);

    if (preloadRef.current == null && photo.image != null) {
      const srcUrl = getSourceSrc(
        photo.image as {
          s3Bucket: string;
          sources: { type: string; s3Key: string; size: number }[];
        },
        3840,
        features.avifSupported ? 'image/avif' : 'image/webp',
      );

      if (srcUrl == null) {
        return;
      }

      preloadRef.current = preloadImageLink(srcUrl);
    }
  }, [features.avifSupported, photo.image]);

  const srcUrl =
    photo.image != null && complete
      ? getSourceSrc(photo.image!, 960, features.avifSupported ? 'image/avif' : 'image/webp')
      : null;
  const [loaded, setLoaded] = useState(() => {
    // synchronously check if the image is already in the browser cache
    if (srcUrl == null) {
      return false;
    }

    const image = new Image();
    image.src = srcUrl;
    return image.complete;
  });
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  if (!complete) {
    return null;
  }
  const TRANSITION_NAME = viewTransitionPhoto(photo.id);

  return (
    <ImageListItem onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
      <Global
        styles={css`
          ::view-transition-old(${TRANSITION_NAME}) {
            animation: none;
            mix-blend-mode: normal;
            animation-timing-function: var(--motion-easin-emphasized-decelerate);
            isolation: isolate;
          }
          ::view-transition-new(${TRANSITION_NAME}) {
            animation: none;
            mix-blend-mode: normal;
            isolation: isolate;
            animation-timing-function: var(--motion-easin-emphasized-accelerate);
          }

          ::view-transition-new(${TRANSITION_NAME}):only-child {
            animation: fade-in 0.3s var(--motion-easing-standard);
          }
        `}
      />
      <Link to={`/location/${photo.location?.slug}/${photo.id}`} data-test="photo-link">
        <StickPointerImage>
          <div
            css={css`
              width: 100%;
              aspect-ratio: ${photo.width} / ${photo.height};
              position: relative;
              overflow: hidden;
            `}
          >
            {photo.blurhash != null && (
              <div
                css={css`
                  overflow: hidden;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  display: ${loaded ? 'none' : 'block'};
                `}
              >
                <Blurhash
                  hash={photo.blurhash}
                  resolutionX={32}
                  resolutionY={32}
                  height="100%"
                  width="100%"
                />
              </div>
            )}
            <img
              src={srcUrl ?? ''}
              alt=""
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={handleLoad}
              css={css`
                view-transition-name: ${TRANSITION_NAME};
                width: 100%;
                height: 100%;
                image-rendering: smooth;
                image-rendering: optimizeSpeed;
                position: relative;
                display: block;
              `}
            />
          </div>
        </StickPointerImage>
        {hovered && (
          <Box
            gap={2}
            css={css`
              position: absolute;
              bottom: 12px;
              right: 12px;
              display: grid;
            `}
          >
            {photo.likesCount > 0 && (
              <PhotoLabel>
                {photo.likesCount} <small>{photo.likesCount > 1 ? 'likes' : 'like'}</small>
              </PhotoLabel>
            )}
            {photo.comments.totalCount > 0 && (
              <PhotoLabel>
                {photo.comments.totalCount}{' '}
                <small>{photo.comments.totalCount > 1 ? 'comments' : 'comment'}</small>
              </PhotoLabel>
            )}
          </Box>
        )}
      </Link>
    </ImageListItem>
  );
});
