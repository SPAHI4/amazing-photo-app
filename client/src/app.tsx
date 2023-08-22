import { Outlet, ScrollRestoration } from 'react-router-dom';
import { css, Global } from '@emotion/react';
import { memo, useLayoutEffect, useRef } from 'react';
import { useCurrentUser } from './hooks/use-user.ts';
import { CursorProvider } from './ui-components/cursor.tsx';

const Styles = memo(() => (
  <Global
    styles={css`
      :root {
        --motion-easing-emphasized: cubic-bezier(0.4, 0, 0.2, 1);
        --motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
        --motion-easin-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
        --motion-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
        --motion-easing-decelerate: cubic-bezier(0, 0, 0, 1);
        --motion-easing-accelerate: cubic-bezier(0.3, 0, 1, 1);

        --easing-bounce: cubic-bezier(0.5, 2.05, 0.58, -0.25);

        -webkit-font-smoothing: antialiased;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
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

      .view-transition-lock * {
        view-transition-name: unset !important;
      }

      body {
        visibility: hidden;

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

export function App() {
  useCurrentUser();
  const fontsLoaded = useRef(false);

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

  return (
    <CursorProvider>
      <ScrollRestoration getKey={(location) => location.pathname} />
      <Styles />
      <Outlet />
    </CursorProvider>
  );
}
