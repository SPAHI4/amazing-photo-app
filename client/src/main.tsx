import React, { Suspense } from 'react';
import type {} from '@mui/material/themeCssVarsAugmentation';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { makeTheme } from './make-theme.tsx';
import { apolloClient } from './apollo-client.ts';
import { router } from './router.tsx';
import { MainSkeleton } from './app-components/main-skeleton.tsx';
import { ErrorFallback } from './app-components/error-fallback.tsx';

export const rootElement = document.getElementById('root');
const appTheme = makeTheme({ rootElement: rootElement as HTMLDivElement });
const canUseTransition = 'startViewTransition' in document;

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_DEPLOYMENT,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', import.meta.env.VITE_GRAPHQL_ENDPOINT],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <StyledEngineProvider>
          <CssVarsProvider theme={appTheme} disableTransitionOnChange={canUseTransition}>
            <CssBaseline />
            <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
              <Suspense fallback={<MainSkeleton />}>
                <ApolloProvider client={apolloClient}>
                  <RouterProvider router={router} future={{ v7_startTransition: false }} />
                </ApolloProvider>
              </Suspense>
            </Sentry.ErrorBoundary>
          </CssVarsProvider>
        </StyledEngineProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
