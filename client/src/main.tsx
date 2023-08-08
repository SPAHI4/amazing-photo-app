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

export const rootElement = document.getElementById('root');
const appTheme = makeTheme({ rootElement: rootElement as HTMLDivElement });
const canUseTransition = 'startViewTransition' in document;
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const MainSkeleton = React.memo(() => {
  const theme = useTheme();

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

      <Typography variant="h6">
        Actually, you should not see this because the site is very fast. Though, here we are.
      </Typography>
      <CircularProgress />
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
            defaultColorScheme={prefersDarkMode ? 'dark' : 'light'}
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
