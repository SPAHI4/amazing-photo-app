import React, { Suspense } from 'react';
import type {} from '@mui/material/themeCssVarsAugmentation';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
  useTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { css } from '@emotion/react';
import { makeTheme } from './make-theme.tsx';
import { apolloClient } from './apollo-client.ts';
import { router } from './router.tsx';
import { useThrottledValue } from './hooks/use-throttle.ts';

export const rootElement = document.getElementById('root');
const appTheme = makeTheme({ rootElement: rootElement as HTMLDivElement });
const canUseTransition = 'startViewTransition' in document;

const MainSkeleton = React.memo(() => {
  const theme = useTheme();
  const [rendered, setRendered] = React.useState(false);
  const show = useThrottledValue(rendered, 1000);

  React.useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <div
      css={css`
        height: 100dvh;
        display: grid;
        place-items: center;
      `}
    >
      <div
        css={css`
          height: 72px;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          background-color: ${theme.vars.palette.AppBar.defaultBg};
        `}
      />

      {show && (
        <>
          <Typography variant="h6">
            Actually, you should not see this because the site is very fast. Though, here we are.
          </Typography>
          <CircularProgress />
        </>
      )}
    </div>
  );
});

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <StyledEngineProvider injectFirst>
          <CssVarsProvider
            theme={appTheme}
            disableTransitionOnChange={canUseTransition}
            // @ts-expect-error types are wrong, this is a valid value
            defaultColorScheme="system"
          >
            <CssBaseline />
            <Suspense fallback={<MainSkeleton />}>
              <ApolloProvider client={apolloClient}>
                <RouterProvider router={router} future={{ v7_startTransition: false }} />
              </ApolloProvider>
            </Suspense>
          </CssVarsProvider>
        </StyledEngineProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
