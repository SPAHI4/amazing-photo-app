import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { css, Global } from '@emotion/react';
import { useNavigation } from 'react-router-dom';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { useThrottledValue } from '../hooks/use-throttle.ts';
import { CursorContext, CursorContextValue } from './cursor-context.tsx';

/*
 * Context components
 *
 * 1. useCursor hook
 * 2. CursorProvider, which provides context for the cursor and handles cursor state, logic and rendering
 * 3. StickPointerButton, which is a button that sticks the cursor to it
 * 4. StickPointerText, which is a text that sticks the cursor to it
 * 5. StickPointerImage, which is an image that sticks the cursor to it
 *
 * Stick*** components contain logic for cursor animation, some logic is duplicated to simplify the code
 */

export const useCursor = (): CursorContextValue => {
  const context = useContext(CursorContext);

  if (context == null) {
    throw new Error('useCursor must be used within a CursorProvider');
  }

  return context;
};

export const CursorProvider = memo(({ children }: { children: React.ReactNode }) => {
  const navigation = useNavigation();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLocked = useRef(false);
  const state = useThrottledValue(navigation.state, 100);

  // show loading state until react-router navigation is complete (handles lazy loading, route loaders, etc.)
  const loading = state === 'loading' && !['error', 'idle'].includes(navigation.state);

  // enable cursor only on desktop
  const cursorEnabled = useMediaQuery('(min-width: 600px)');

  useLayoutEffect(() => {
    if (!cursorEnabled) {
      return () => {};
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!cursorLocked.current) {
        cursorRef.current?.style.setProperty('--cursor-x', `${event.clientX}px`);
        cursorRef.current?.style.setProperty('--cursor-y', `${event.clientY}px`);
      }
    };
    const handleMouseDown = () => {
      if (!cursorLocked.current) {
        cursorRef.current?.style.setProperty('--cursor-scale', '0.8');
        cursorRef.current?.style.setProperty('--cursor-scale-x', '0.8');
      }
    };

    const handleMouseUp = () => {
      if (!cursorLocked.current) {
        cursorRef.current?.style.setProperty('--cursor-scale', '1');
        cursorRef.current?.style.setProperty('--cursor-scale-x', '1');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorEnabled]);

  const resetCursor = useCallback(() => {
    cursorRef.current?.style.setProperty('--cursor-scale', '1');
    cursorRef.current?.style.setProperty('--cursor-scale-x', '1');
    cursorRef.current?.style.setProperty('--cursor-width', 'var(--cursor-default-size)');
    cursorRef.current?.style.setProperty('--cursor-height', 'var(--cursor-default-size)');
    cursorRef.current?.style.setProperty('--cursor-border-radius', 'var(--cursor-default-size)');
    cursorRef.current?.style.setProperty('--cursor-translate-x', '0px');
    cursorRef.current?.style.setProperty('--cursor-translate-y', '0px');
    cursorRef.current?.style.setProperty('--cursor-mix-blend-mode', 'exclusion');
    cursorRef.current?.style.setProperty('--cursor-background-color', '#fff');
  }, []);

  // lock means cursor is sticked to some element
  const lockCursor = useCallback(() => {
    cursorLocked.current = true;
    cursorRef.current?.style.setProperty(
      'transition-property',
      'width, height, border-radius, scale, top, left, background-color',
    );
  }, []);

  const unlockCursor = useCallback(({ shouldAnimateRect }: { shouldAnimateRect?: boolean }) => {
    cursorLocked.current = false;
    cursorRef.current?.style.setProperty(
      'transition-property',
      shouldAnimateRect === true
        ? 'width, height, border-radius, scale, background-color'
        : 'border-radius, scale, background-color',
    );
  }, []);

  useLayoutEffect(() => {
    if (loading) {
      resetCursor();
    }
  }, [loading, resetCursor]);

  const value = useMemo(
    () => ({
      cursorRef,
      lockCursor,
      unlockCursor,
      resetCursor,
      cursorEnabled,
    }),
    [cursorRef, lockCursor, unlockCursor, resetCursor, cursorEnabled],
  );

  return (
    <CursorContext.Provider value={value}>
      {cursorEnabled && (
        <>
          <Global
            styles={css`
              :root {
                --cursor-default-size: 24px;
                --cursor-height: var(--cursor-default-size);
                --cursor-width: var(--cursor-default-size);
                --cursor-border-radius: var(--cursor-default-size);
                --cursor-x: 0;
                --cursor-y: 0;
                --cursor-scale: 1;
                --cursor-scale-x: 1;
                --cursor-translate-x: 0px;
                --cursor-translate-y: 0px;
                --cursor-mix-blend-mode: exclusion;
                --cursor-background-color: #fff;
              }

              * {
                cursor: none !important;
              }
            `}
          />
          <div
            ref={cursorRef}
            css={css`
              top: var(--cursor-y);
              left: var(--cursor-x);
              width: var(--cursor-width);
              height: var(--cursor-height);
              scale: var(--cursor-scale, 1) var(--cursor-scale-x, 1);
              border-radius: var(--cursor-border-radius);
              mix-blend-mode: var(--cursor-mix-blend-mode);
              background-color: var(--cursor-background-color);

              translate: calc(-50% + var(--cursor-translate-x, 0px))
                calc(-50% + var(--cursor-translate-y, 0px));
              transition-duration: 0.1s;
              transition-timing-function: var(--motion-easing-emphasized-decelerate);
              transition-property: width, height, border-radius, scale, background-color;
              transform-origin: center;
              z-index: 99999999;
              position: fixed;
              pointer-events: none;
            `}
          >
            {loading && (
              <CircularProgress
                size="calc(var(--cursor-default-size) * 2)"
                thickness={10}
                css={css`
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  z-index: -1;
                  translate: -50% -50%;
                `}
              />
            )}
          </div>
        </>
      )}
      {children}
    </CursorContext.Provider>
  );
});

interface StickPointerButtonProps {
  children: React.ReactElement;
  locked?: boolean;
}

export const StickPointerButton = memo((props: StickPointerButtonProps) => {
  const { cursorRef, lockCursor, unlockCursor, resetCursor, cursorEnabled } = useCursor();

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!cursorEnabled) {
      return () => {};
    }

    const targetElem = ref.current;
    const cursorElem = cursorRef.current;
    // <enter> could be not fired if a child element is hovered first
    let enterFired = true;

    if (targetElem == null || cursorElem == null) {
      return () => {};
    }

    targetElem.style.setProperty('translate', 'var(--translate-x, 0) var(--translate-y, 0)');
    targetElem.style.setProperty('scale', 'var(--scale, 1)');
    targetElem.style.setProperty('transition-duration', '0.1s');
    targetElem.style.setProperty(
      'transition-timing-function',
      'var(--motion-easing-emphasized-decelerate)',
    );
    targetElem.style.setProperty('transition-property', 'translate, scale');

    const handleMouseEnter = () => {
      lockCursor();
      enterFired = true;

      const rect = targetElem.getBoundingClientRect();

      targetElem.style.setProperty('--scale', '1.05');

      cursorElem.style.setProperty('--cursor-scale', '1.05');
      cursorElem.style.setProperty('--cursor-scale-x', '1.05');
      cursorElem.style.setProperty('--cursor-x', `${rect.left + rect.width / 2}px`);
      cursorElem.style.setProperty('--cursor-y', `${rect.top + rect.height / 2}px`);
      cursorElem.style.setProperty('--cursor-width', `${rect.width}px`);
      cursorElem.style.setProperty('--cursor-height', `${rect.height}px`);
      cursorElem.style.setProperty(
        '--cursor-border-radius',
        window.getComputedStyle(targetElem).borderRadius,
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!enterFired) {
        handleMouseEnter();
      }
      const rect = targetElem.getBoundingClientRect();

      const halfHeight = rect.height / 2;
      const offsetY = event.clientY - rect.top - halfHeight;
      const ratioY = offsetY / halfHeight;
      targetElem.style.setProperty('--translate-y', `${(ratioY * rect.height) / 15}px`);
      cursorElem.style.setProperty('--cursor-translate-y', `${(ratioY * rect.height) / 17}px`);

      const halfWidth = rect.width / 2;
      const offsetX = event.clientX - rect.left - halfWidth;
      const ratioX = offsetX / halfWidth;
      targetElem.style.setProperty('--translate-x', `${(ratioX * rect.width) / 15}px`);
      cursorElem.style.setProperty('--cursor-translate-x', `${(ratioX * rect.width) / 17}px`);
    };

    const handleMouseOut = () => {
      enterFired = false;

      targetElem.style.setProperty('--scale', '1');
      targetElem.style.setProperty('--translate-x', '0px');
      targetElem.style.setProperty('--translate-y', '0px');

      resetCursor();
      unlockCursor({ shouldAnimateRect: true });
    };

    targetElem.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    targetElem.addEventListener('mousemove', handleMouseMove, { passive: true });
    targetElem.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('scroll', handleMouseOut, { passive: true });

    return () => {
      targetElem.removeEventListener('mouseenter', handleMouseEnter);
      targetElem.removeEventListener('mousemove', handleMouseMove);
      targetElem.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('scroll', handleMouseOut);

      resetCursor();
      unlockCursor({ shouldAnimateRect: false });
    };
  }, [unlockCursor, lockCursor, resetCursor, cursorRef, props.locked, cursorEnabled]);

  return React.cloneElement(React.Children.only(props.children), { ref });
});

interface StickPointerTextProps {
  children: React.ReactElement;
}

export const StickPointerText = memo((props: StickPointerTextProps) => {
  const { cursorRef, resetCursor, cursorEnabled } = useCursor();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!cursorEnabled) {
      return () => {};
    }

    const targetElem = ref.current;
    const cursorElem = cursorRef.current;
    if (targetElem == null || cursorElem == null) {
      return () => {};
    }

    const handleMouseOver = (event: MouseEvent) => {
      const fontSize = parseInt(
        window.getComputedStyle(event.target as HTMLElement).getPropertyValue('font-size'),
        10,
      );
      cursorElem.style.setProperty('--cursor-width', `${fontSize * 0.2}px`);
      cursorElem.style.setProperty('--cursor-height', `${fontSize * 1.6}px`);
    };

    const handleMouseOut = () => {
      resetCursor();
    };

    targetElem.addEventListener('mouseover', handleMouseOver, {
      passive: true,
    });
    targetElem.addEventListener('mouseout', handleMouseOut, {
      passive: true,
    });

    return () => {
      targetElem.removeEventListener('mouseover', handleMouseOver);
      targetElem.removeEventListener('mouseout', handleMouseOut);
      resetCursor();
    };
  }, [cursorEnabled, cursorRef, resetCursor]);

  return React.cloneElement(React.Children.only(props.children), { ref });
});

interface StickPointerImageProps {
  children: React.ReactElement;
}

export const StickPointerImage = memo((props: StickPointerImageProps) => {
  const { cursorRef, lockCursor, unlockCursor, resetCursor, cursorEnabled } = useCursor();

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!cursorEnabled) {
      return () => {};
    }

    const targetElem = ref.current;
    const cursorElem = cursorRef.current;
    // <enter> could be not fired because of child elements
    let enterFired = true;

    if (targetElem == null || cursorElem == null) {
      return () => {};
    }

    targetElem.style.setProperty('translate', 'var(--translate-x, 0) var(--translate-y, 0)');
    targetElem.style.setProperty('scale', 'var(--scale, 1)');
    targetElem.style.setProperty('transition-duration', '0.1s');
    targetElem.style.setProperty(
      'transition-timing-function',
      'var(--motion-easing-emphasized-decelerate)',
    );
    targetElem.style.setProperty('transition-property', 'translate, scale');

    const handleMouseEnter = () => {
      lockCursor();
      enterFired = true;

      const rect = targetElem.getBoundingClientRect();

      targetElem.style.setProperty('--scale', '1.05');
      cursorElem.style.setProperty('--cursor-scale', '1.05');
      cursorElem.style.setProperty('--cursor-scale-x', '1.025');

      cursorElem.style.setProperty('--cursor-x', `${rect.left + rect.width / 2}px`);
      cursorElem.style.setProperty('--cursor-y', `${rect.top + rect.height / 2}px`);
      cursorElem.style.setProperty('--cursor-width', `${rect.width}px`);
      cursorElem.style.setProperty('--cursor-height', `${rect.height + 16}px`);
      cursorElem.style.setProperty(
        '--cursor-border-radius',
        window.getComputedStyle(targetElem).borderRadius,
      );
      cursorElem.style.setProperty('--cursor-mix-blend-mode', 'soft-light');
      cursorElem.style.setProperty('--cursor-background-color', 'rgba(255, 255, 255, 0.5)');
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!enterFired) {
        handleMouseEnter();
      }
      const rect = targetElem.getBoundingClientRect();

      const halfHeight = rect.height / 2;
      const offsetY = event.clientY - rect.top - halfHeight;
      const ratioY = offsetY / halfHeight;
      targetElem.style.setProperty('--translate-y', `${(ratioY * rect.height) / 25}px`);
      cursorElem.style.setProperty('--cursor-translate-y', `${(ratioY * rect.height) / 25}px`);

      const halfWidth = rect.width / 2;
      const offsetX = event.clientX - rect.left - halfWidth;
      const ratioX = offsetX / halfWidth;
      targetElem.style.setProperty('--translate-x', `${(ratioX * rect.width) / 25}px`);
      cursorElem.style.setProperty('--cursor-translate-x', `${(ratioX * rect.width) / 25}px`);
    };

    const handleMouseOut = () => {
      enterFired = false;

      targetElem.style.setProperty('--scale', '1');
      targetElem.style.setProperty('--translate-x', '0px');
      targetElem.style.setProperty('--translate-y', '0px');

      resetCursor();
      unlockCursor({ shouldAnimateRect: true });
    };

    targetElem.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    targetElem.addEventListener('mousemove', handleMouseMove, { passive: true });
    targetElem.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('scroll', handleMouseOut, { passive: true });

    return () => {
      targetElem.removeEventListener('mouseenter', handleMouseEnter);
      targetElem.removeEventListener('mousemove', handleMouseMove);
      targetElem.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('scroll', handleMouseOut);

      resetCursor();
      unlockCursor({ shouldAnimateRect: false });
    };
  }, [unlockCursor, lockCursor, resetCursor, cursorRef, cursorEnabled]);

  return React.cloneElement(React.Children.only(props.children), { ref });
});
