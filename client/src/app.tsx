import { Outlet, ScrollRestoration } from 'react-router-dom';
import { css, Global } from '@emotion/react';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Slide, Snackbar } from '@mui/material';
import { ServerError, ServerParseError } from '@apollo/client';
import { GraphQLError } from 'graphql/error';
import { NetworkError } from '@apollo/client/errors';
import { useCurrentUser } from './hooks/use-user.ts';
import { CursorProvider } from './ui-components/cursor.tsx';
import { graphqlErrorsObservable } from './apollo-client.ts';

const Styles = memo(() => (
  <Global
    styles={css`
      :root {
        // https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration
        --motion-easing-emphasized: cubic-bezier(0.4, 0, 0.2, 1);
        --motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
        --motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
        --motion-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
        --motion-easing-decelerate: cubic-bezier(0, 0, 0, 1);
        --motion-easing-accelerate: cubic-bezier(0.3, 0, 1, 1);
        --easing-bounce: cubic-bezier(0.5, 2.05, 0.58, -0.25);
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fade-out {
        to {
          opacity: 0;
        }
      }

      @keyframes scale-in {
        from {
          scale: 2;
        }
      }

      @keyframes scale-in-maxed {
        from {
          scale: 10;
        }
      }

      @keyframes scale-out {
        to {
          scale: 0;
        }
      }

      @keyframes slide-from-right {
        from {
          transform: translateX(30px);
        }
      }

      @keyframes slide-to-left {
        to {
          transform: translateX(-30px);
        }
      }

      @keyframes slide-from-bottom {
        from {
          transform: translateY(30px);
        }
      }

      @keyframes slide-from-top {
        from {
          transform: translateY(-30px);
        }
      }

      // disable any view transitions for theme change animation
      .view-transition-lock {
        pointer-events: none;

        & * {
          view-transition-name: unset !important;
        }
      }

      body {
        visibility: hidden;

        -webkit-font-smoothing: antialiased;

        &.fonts-loaded {
          visibility: visible;
        }
      }
    `}
  />
));

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const ErrorSnackbar = memo(() => {
  const [[firstError], setErrors] = useState<
    Error[] | [ServerParseError] | [ServerError] | GraphQLError[] | [NetworkError]
  >([]);

  useEffect(() => {
    const subscription = graphqlErrorsObservable.subscribe((newErrors) => {
      setErrors(newErrors);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Snackbar
      open={firstError != null}
      onClose={() => setErrors([])}
      message={firstError?.message}
      TransitionComponent={Slide}
      autoHideDuration={6000}
      key={firstError?.message ?? 'error'}
    />
  );
});

const useFontsLoaded = () => {
  const fontsLoaded = useRef(false);

  // Wait for fonts to load before showing the app
  useLayoutEffect(() => {
    (async () => {
      if (fontsLoaded.current) {
        return;
      }

      await Promise.race([wait(100), document.fonts.ready]);
      fontsLoaded.current = true;

      if ('startViewTransition' in document) {
        document.startViewTransition(() => {
          document.body.classList.add('fonts-loaded');
        });
      } else {
        (document as Document).body.classList.add('fonts-loaded');
      }
    })();
  }, []);
};

export const App = memo(() => {
  useCurrentUser();
  useFontsLoaded();

  return (
    <CursorProvider>
      <ErrorSnackbar />
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Styles />
      <Outlet />
    </CursorProvider>
  );
});
