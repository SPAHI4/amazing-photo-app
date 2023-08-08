import { Box, Button, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { css, Global } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useFragment } from '@apollo/client';
import { memo } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { HeaderNavigation } from '../../app-components/header-navigation.tsx';
import { graphql } from '../../__generated__/gql.ts';
import { IconArrowBack } from '../../icons.tsx';

const PHOTO_HEADER_PHOTO = graphql(`
  fragment PhotoHeader_photo on Photo {
    id
    location {
      id
      slug
      name
    }
  }
`);

interface PhotoHeaderProps {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
}

export const VIEW_TRANSITION_PHOTO_HEADER = 'photo-header';

export const PhotoHeader = memo((props: PhotoHeaderProps) => {
  const { data: photo } = useFragment({
    fragment: PHOTO_HEADER_PHOTO,
    fragmentName: 'PhotoHeader_photo',
    from: props.photo,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Global
        styles={css`
          /* Entry transition */
          ::view-transition-new(${VIEW_TRANSITION_PHOTO_HEADER}):only-child {
            animation:
              300ms var(--motion-easing-decelerate) both fade-in,
              300ms var(--motion-easing-emphasized-decelerate) both slide-from-top;
            animation-delay: 600ms;
          }
        `}
      />
      <Box
        height={isMobile ? 60 : 72}
        px={3}
        css={css`
          view-transition-name: ${VIEW_TRANSITION_PHOTO_HEADER};
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: ${theme.vars.palette.background.paper};
          grid-area: photo-header;
        `}
      >
        <StickPointerButton>
          <Button
            component={Link}
            to={`/location/${photo.location?.slug}`}
            color="inherit"
            css={css`
              display: flex;
              align-items: center;
            `}
            startIcon={
              <SvgIcon
                css={css`
                  height: 36px;
                  width: 36px;
                `}
              >
                <IconArrowBack />
              </SvgIcon>
            }
          >
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom={false}>
              {photo.location?.name}
            </Typography>
          </Button>
        </StickPointerButton>
        {!isMobile && <HeaderNavigation />}
      </Box>
    </>
  );
});
