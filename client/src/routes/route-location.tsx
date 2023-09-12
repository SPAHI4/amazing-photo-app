import { Box, Button, Container, Paper, Typography, useMediaQuery } from '@mui/material';
import { css, Global } from '@emotion/react';
import React, { useCallback, useLayoutEffect, useState, useTransition } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSuspenseQuery } from '@apollo/client';
import { Masonry } from '@mui/lab';
import { useLocalStorage } from 'react-use/esm';
import useTheme from '@mui/material/styles/useTheme';
import { Helmet } from 'react-helmet-async';
import { notEmpty } from '../utils/array.ts';
import { StickPointerButton, StickPointerText } from '../ui-components/cursor.tsx';
import { PhotoCard } from '../features/photo/photo-card.tsx';
import { useBrowserFeatures } from '../hooks/use-browser-features.ts';
import { ROUTE_LOCATION_QUERY } from '../loaders/route-location-loader.ts';
import { LoadMoreContainer } from '../ui-components/load-more-conainer.tsx';
import { viewTransitionLocationHeader } from '../utils/view-transitions.ts';
import { useSafeTimeout } from '../hooks/use-safe-timeout.ts';

function HDRBanner() {
  const theme = useTheme();
  const features = useBrowserFeatures();
  const initialShow = !features.isChromuimBased || !features.hdrSupported;
  const [show, setShow] = useLocalStorage('hdr-banner', initialShow);
  const visible = show === true && initialShow;

  return (
    visible && (
      <Box
        my={2}
        component={Paper}
        css={css`
          border: 1px ${theme.vars.palette.divider} solid;
          display: grid;
          grid-template-columns: 1fr 400px;

          ${theme.breakpoints.down('md')} {
            grid-template-columns: 1fr;
          }
        `}
      >
        <Box p={4}>
          <StickPointerText>
            <Typography variant="quote">
              <p>
                This website is better enjoyed with <strong>HDR</strong> display
                {!features.isChromuimBased && ' in Chrome Browser'}. I hope you have one, because
                these <strong>bright</strong> pictures are really stunning!
              </p>
            </Typography>
          </StickPointerText>
          <Box display="flex" gap={2}>
            <StickPointerButton>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setShow(false);
                }}
              >
                Got it
              </Button>
            </StickPointerButton>
          </Box>
        </Box>
        <Box
          css={css`
            display: flex;
          `}
        >
          <img
            src="/hdr-meme.webp"
            alt="hdr meme"
            css={css`
              width: 100%;
            `}
          />
        </Box>
      </Box>
    )
  );
}

function Location() {
  const { slug = '' } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [setTimeoutSafe] = useSafeTimeout();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { viewTransitionSupported } = useBrowserFeatures();
  const [isPending, startTransition] = useTransition();
  const PAGE_SIZE = 20;
  const { data, fetchMore } = useSuspenseQuery(ROUTE_LOCATION_QUERY, {
    variables: {
      slug,
      after: null,
      first: PAGE_SIZE,
    },
    fetchPolicy: 'cache-first',
  });
  const photos = data.location?.photos.edges.map((edge) => edge.node).filter(notEmpty) ?? [];
  const nameParts: string[] = data.location?.name.split(' ') ?? [];

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      fetchMore({
        variables: {
          slug,
          after: data.location?.photos.pageInfo.endCursor,
          first: PAGE_SIZE,
        },
      });
    });
  }, [data, fetchMore, slug, startTransition]);

  // view transition api doesn't work well enough with large hdr images, so we defer them to move out from transition
  const shouldDeferPhotos =
    (location.state as Record<string, string> | undefined)?.from === 'main' &&
    viewTransitionSupported;

  const [visible, setVisible] = useState(!shouldDeferPhotos);

  console.log({ shouldDeferPhotos, visible });

  useLayoutEffect(() => {
    if (shouldDeferPhotos) {
      setTimeoutSafe(() => {
        setVisible(true);
        navigate(location.pathname, { replace: true, state: undefined });
      }, 600);
    }
  }, [location.pathname, navigate, setTimeoutSafe, shouldDeferPhotos]);

  const photosList = photos.map((photo, index) => (
    <PhotoCard key={photo.id} photo={photo} index={index} />
  ));

  return (
    <>
      <Helmet>
        <title>
          {import.meta.env.VITE_BASE_TITLE} / {data.location?.name}
        </title>
      </Helmet>
      <HDRBanner />
      <div>
        <Typography
          variant="h1"
          gutterBottom={false}
          id={`header-${slug}`}
          css={css`
            font-family: ${theme.typography.h1.fontFamily};
            font-weight: 900;
            text-transform: uppercase;
            font-size: 130px;

            ${theme.breakpoints.down('md')} {
              font-size: 50px;
            }
          `}
        >
          {nameParts.map((part, index) => {
            const TRANSITION_NAME = viewTransitionLocationHeader(slug, index);
            return (
              <React.Fragment key={part}>
                <Global
                  styles={css`
                    ::view-transition-old(${TRANSITION_NAME}),
                    ::view-transition-new(${TRANSITION_NAME}) {
                      animation-timing-function: var(--motion-easing-emphasized);
                    }
                  `}
                />
                <span
                  css={css`
                    view-transition-name: ${TRANSITION_NAME};
                    width: fit-content;
                  `}
                >
                  {part}
                </span>{' '}
              </React.Fragment>
            );
          })}
        </Typography>

        <Box mb={{ md: 4, lg: 8 }}>
          <StickPointerText>
            <Typography
              component="blockquote"
              variant="subtitle1"
              css={css`
                font-family: 'Literata', serif;
                font-style: italic;
              `}
            >
              <p>{data.location?.description}</p>
            </Typography>
          </StickPointerText>
        </Box>
      </div>
      {isMobile
        ? photosList
        : visible && (
            <Masonry
              columns={2}
              spacing={4}
              css={css`
                animation: 0.3s fade-in var(--motion-easing-standard);
              `}
            >
              {photosList}
            </Masonry>
          )}
      {data.location?.photos.pageInfo.hasNextPage === true && (
        <LoadMoreContainer loading={isPending} onLoadMore={handleLoadMore} />
      )}
    </>
  );
}

export function RouteLocation() {
  return (
    <Container>
      <Box display="grid" gap={3} py={4}>
        <Location />
      </Box>
    </Container>
  );
}
