import { useSuspenseQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { css, Global } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'react-use/esm';
import useTheme from '@mui/material/styles/useTheme';
import { Helmet } from 'react-helmet-async';
import { notEmpty } from '../utils/array.ts';
import { Globe } from '../ui-components/globe.tsx';
import { useThrottle } from '../hooks/use-throttle.ts';
import { StickPointerButton, StickPointerText } from '../ui-components/cursor.tsx';
import { viewTransitionLocationHeader } from '../utils/view-transitions.ts';
import { useBrowserFeatures } from '../hooks/use-browser-features.ts';
import { ROUTE_MAIN_QUERY } from '../loaders/route-main-loader.ts';
import { RouteMainQueryQuery } from '../__generated__/graphql.ts';

function BrowserBanner() {
  const theme = useTheme();
  const features = useBrowserFeatures();
  const [show, setShow] = useLocalStorage('browser-banner', !features.isChromuimBased);

  return (
    show === true && (
      <Box
        p={4}
        my={2}
        component={Paper}
        css={css`
          border: 1px ${theme.vars.palette.divider} solid;
        `}
      >
        <StickPointerText>
          <Typography variant="quote">
            <p>
              This website is better enjoyed with Chrome Browser. Or based on Chrome ones, like
              Opera, or Arc, or whatever you want
            </p>
            <p>I mean, really... you have to try</p>
          </Typography>
        </StickPointerText>
        <Box display="flex" gap={2}>
          <StickPointerButton>
            <Button
              variant="outlined"
              component="a"
              target="_blank"
              href="https://www.google.com/intl/en_uk/chrome/"
            >
              Go to download
            </Button>
          </StickPointerButton>
          <StickPointerButton>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                setShow(false);
              }}
            >
              I don&apos;t mind
            </Button>
          </StickPointerButton>
        </Box>
      </Box>
    )
  );
}

function Quote() {
  return (
    <Box p={4} my={2} component={Paper}>
      <StickPointerText>
        <div>
          <Typography variant="quote">
            Welcome to this little website. I&apos;m excited to share with you my delightful
            experiences of exploring Europe and Asia, along with some captivating cities from my
            beautiful homeland of Russia.
          </Typography>
          <Typography variant="subtitle2" textAlign="right">
            — {import.meta.env.VITE_CONTACT_NAME},{' '}
            <cite>Software engineer & travel photographer</cite>
          </Typography>
        </div>
      </StickPointerText>
    </Box>
  );
}

interface LocationLinkProps {
  location: NonNullable<RouteMainQueryQuery['locations']>['nodes'][number];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function LocationLink({ location, onMouseEnter, onMouseLeave }: LocationLinkProps) {
  const theme = useTheme();
  const nameParts = location.name.split(' ');

  return (
    <StickPointerButton>
      <MuiLink
        component={Link}
        to={`/location/${location.slug}`}
        color="inherit"
        css={css`
          line-height: 1;
          padding: 8px 0;
          text-decoration: underline transparent;
          width: fit-content;
          font-family: ${theme.typography.h1.fontFamily};
          font-weight: 900;
          text-transform: uppercase;
          font-size: 100px;
          &:hover {
            text-decoration: none;
          }

          ${theme.breakpoints.down('md')} {
            font-size: 50px;
          }
        `}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {nameParts.map((part, index) => {
          const TRANSITION_NAME = viewTransitionLocationHeader(location.slug, index);

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
                  display: inline;
                `}
              >
                {part}
              </span>{' '}
            </React.Fragment>
          );
        })}
      </MuiLink>
    </StickPointerButton>
  );
}

function LocationsList() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { data } = useSuspenseQuery(ROUTE_MAIN_QUERY, {
    fetchPolicy: 'cache-first',
  });
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const locations = useMemo(
    () => data.locations?.nodes.filter(notEmpty) ?? [],
    [data.locations?.nodes],
  );
  const [resetGeo, cancelResetGeo] = useThrottle(() => {
    setGeo(null);
  }, 1500);

  const locationsList = useMemo(
    () =>
      locations.map((location) => (
        <LocationLink
          key={location.id}
          location={location}
          onMouseEnter={() => {
            cancelResetGeo();
            setGeo({ lat: location.geo.x, lng: location.geo.y });
          }}
          onMouseLeave={resetGeo}
        />
      )),
    [cancelResetGeo, locations, resetGeo],
  );

  const globeLocations = useMemo(
    () => locations.map((location) => ({ lat: location.geo.x, lng: location.geo.y })),
    [locations],
  );

  return isMobile ? (
    <Container
      css={css`
        display: grid;
      `}
    >
      {locationsList}
    </Container>
  ) : (
    <div
      css={css`
        position: relative;
        overflow: hidden;
        min-height: 100%;
        display: grid;
        padding-bottom: 60px;
        grid-template-rows: 0 1fr;
        place-items: center;
      `}
    >
      <div
        css={css`
          position: sticky;
          top: 0;
          right: 0;
          z-index: -1;
          height: 0;
          overflow: visible;
          translate: 45% -50%;
        `}
      >
        <Globe currentLocation={geo} locations={globeLocations} />
      </div>
      <Container>
        <div
          css={css`
            display: grid;
          `}
        >
          {locationsList}
        </div>
      </Container>
    </div>
  );
}

export function RouteMain() {
  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE}</title>
        <meta
          name="description"
          content={`
          ${
            import.meta.env.VITE_BASE_TITLE
          } is a travel photoblog. It contains photos from Europe and Asia, along with some captivating cities from Russia.
          `}
        />
      </Helmet>
      <Box>
        <Container>
          <BrowserBanner />
          <Quote />
        </Container>

        <LocationsList />
      </Box>
    </>
  );
}
