import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import { useFullscreen } from 'react-use/esm';
import { Helmet } from 'react-helmet-async';
import { graphql } from '../__generated__/gql.ts';
import { PhotoComments } from '../features/photo/photo-comments.tsx';
import { PhotoInfo } from '../features/photo/photo-info.tsx';
import { PhotoImage } from '../features/photo/photo-image.tsx';
import { PhotoHeader } from '../features/photo/photo-header.tsx';

// fragment contains essential data for transition
graphql(`
  fragment RoutePhoto_EssentialsFragment on Photo {
    ...PhotoInfo_photo @nonreactive
    ...PhotoHeader_photo @nonreactive
    ...PhotoImage_photo @nonreactive
    id
    location {
      id
      name
      slug
    }
  }
`);

export const ROUTE_PHOTO_QUERY = graphql(`
  query RoutePhotoQuery($id: Int!) {
    photo(id: $id) {
      id
      ...RoutePhoto_EssentialsFragment
      ...PhotoComments_photo @nonreactive
      ...PhotoLikes_photo @nonreactive
    }
  }
`);

export function RoutePhoto() {
  const theme = useTheme();
  const params = useParams();
  const imgRef = useRef<HTMLPictureElement>(null);
  const photoId = parseInt(params.photoId ?? '', 10);
  const [fullscreen, setFullscreen] = useState(false);
  useFullscreen(imgRef, fullscreen, {
    onClose: () => {
      setFullscreen(false);
    },
  });

  // don't use suspenseQuery to get partial data, we use it for the transition between route-location and route-photo (this)
  const { data } = useQuery(ROUTE_PHOTO_QUERY, {
    variables: {
      id: photoId,
    },
    returnPartialData: true,
    fetchPolicy: 'cache-first',
  });
  const photo = data?.photo;

  if (photo == null) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {import.meta.env.VITE_BASE_TITLE} / photo from{' '}
          {(photo as unknown as { location?: { name: string } }).location?.name ?? ''}
        </title>
      </Helmet>
      <div
        css={css`
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
          background-color: ${theme.vars.palette.action.disabledBackground};

          display: grid;
          grid-template:
            'photo-header photo-header' auto
            'photo-image photo-comments' 1fr
            'photo-info photo-info' auto
            / 1fr 400px;

          ${theme.breakpoints.down('md')} {
            height: auto;
            padding-bottom: 56px;
            grid-template:
              'photo-header' auto
              'photo-image' 1fr
              'photo-info' auto
              / 100vw;
          }
        `}
      >
        <PhotoHeader photo={photo} />

        <PhotoImage photo={photo} imgRef={imgRef} setFullscreen={setFullscreen} />

        <PhotoInfo photo={photo} setFullscreen={setFullscreen} />

        <PhotoComments photo={photo} />
      </div>
    </>
  );
}
