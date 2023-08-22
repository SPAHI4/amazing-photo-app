import useTheme from '@mui/material/styles/useTheme';
import React, { memo, useCallback, useState } from 'react';
import { Box, ImageListItem } from '@mui/material';
import { css, Global } from '@emotion/react';
import { Link } from 'react-router-dom';
import { Blurhash } from 'react-blurhash';
import { useFragment } from '@apollo/client';
import { StickPointerImage } from '../../ui-components/cursor.tsx';
import { viewTransitionPhoto } from '../../utils/view-transitions.ts';
import { useBrowserFeatures } from '../../hooks/use-browser-features.ts';
import { graphql } from '../../__generated__/gql.ts';
import { notEmpty } from '../../utils/array.ts';

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
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  if (!complete) {
    return null;
  }

  const TRANSITION_NAME = viewTransitionPhoto(photo.id);
  const sources = photo.image?.sources.filter(notEmpty) ?? [];

  const src = sources
    .filter((source) =>
      features.avifSupported ? source.type === 'image/avif' : source.type === 'image/webp',
    )
    .find((source) => source.size === 960);
  const srcUrl =
    src != null ? `https://${photo.image?.s3Bucket}.s3.amazonaws.com/${src.s3Key}` : '';

  return (
    <ImageListItem onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Global
        styles={css`
          ::view-transition-old(${TRANSITION_NAME}) {
            animation: none;
            mix-blend-mode: normal;
            animation-timing-function: var(--motion-easin-emphasized-decelerate);
          }
          ::view-transition-new(${TRANSITION_NAME}) {
            animation: none;
            mix-blend-mode: normal;
            animation-timing-function: var(--motion-easin-emphasized-accelerate);
          }

          ::view-transition-new(${TRANSITION_NAME}):only-child {
            animation: fade-in 0.3s var(--motion-easing-standard);
          }
        `}
      />
      <Link to={`/location/${photo.location?.slug}/${photo.id}`}>
        <StickPointerImage>
          <div
            css={css`
              width: 100%;
              aspect-ratio: ${photo.width} / ${photo.height};
              position: relative;
              overflow: hidden;
            `}
          >
            {photo.blurhash != null && !loaded && (
              <div
                css={css`
                  overflow: hidden;
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
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
              src={srcUrl}
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
