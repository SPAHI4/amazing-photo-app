import { memo, useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { IconButton, SvgIcon } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { css, Global } from '@emotion/react';
import { nextTick } from '../utils/promise.ts';
import { StickPointerButton } from '../ui-components/cursor.tsx';
import { IconDarkMode, IconLightMode } from '../icons.tsx';

export const ThemeChangeButton = memo(() => {
  const { mode, setMode } = useColorScheme();
  const iconRef = useRef<HTMLDivElement>(null);
  const toggleMode = useCallback(
    () => setMode(mode === 'dark' ? 'light' : 'dark'),
    [mode, setMode],
  );
  const [transitioning, setTransitioning] = useState(false);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      const lastClick = event;

      // Fallback for browsers that don't support this API:
      if (!('startViewTransition' in document)) {
        toggleMode();
        return;
      }

      // Get the click position, or fallback to the middle of the screen
      const x = lastClick.clientX;
      const y = lastClick.clientY;
      // Get the distance to the furthest corner
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      setTransitioning(true);

      iconRef.current?.animate(
        {
          rotate: ['0deg', '-270deg'],
          opacity: [1, 0],
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        },
      );

      document.documentElement.classList.add('view-transition-lock');

      const transition = document.startViewTransition(async () => {
        flushSync(() => {
          toggleMode();
        });
        await nextTick();
      });

      // Wait for the pseudo-elements to be created:
      await transition.ready;

      document.documentElement.classList.remove('view-transition-lock');

      // Animate the root's new view
      const animation = document.documentElement.animate(
        {
          clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 500,
          easing: 'ease-in',
          // Specify which pseudo-element to animate
          pseudoElement: '::view-transition-new(root)',
        },
      );

      iconRef.current?.animate(
        {
          rotate: ['-270deg', '0deg'],
          opacity: [0, 1],
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        },
      );

      animation.onfinish = () => {
        setTransitioning(false);
      };
    },
    [toggleMode],
  );

  return (
    <>
      {transitioning && (
        <Global
          styles={css`
            ::view-transition-image-pair(root) {
              isolation: auto;
            }

            ::view-transition-old(root),
            ::view-transition-new(root) {
              animation: none;
              mix-blend-mode: normal;
              display: block;
            }
          `}
        />
      )}

      <div ref={iconRef}>
        <StickPointerButton>
          <IconButton onClick={handleClick} aria-hidden>
            <SvgIcon>{mode === 'light' ? <IconLightMode /> : <IconDarkMode />}</SvgIcon>
          </IconButton>
        </StickPointerButton>
      </div>
    </>
  );
});
