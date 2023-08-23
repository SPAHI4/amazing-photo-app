import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, IconButton, SvgIcon, Theme, useMediaQuery } from '@mui/material';
import { Global, css } from '@emotion/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { HeaderNavigation } from './header-navigation.tsx';
import { ThemeChangeButton } from './theme-change-button.tsx';
import { IconMenu } from '../icons.tsx';
import { FooterNavigation } from './footer-navigation.tsx';

const MobileDrawerLazy = lazy(async () => {
  const module = await import('./mobile-drawer.tsx');
  return { default: module.MobileDrawer };
});

function LayoutMobile() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={null}>
        <MobileDrawerLazy open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} />
      </Suspense>
      <Box
        css={css`
          display: grid;
          grid-template-rows: auto 1fr;
          min-height: 100dvh;
          position: relative;
        `}
      >
        <Box
          px={2}
          py={1}
          css={css`
            position: sticky;
            top: 0;
            width: 100%;
            z-index: ${theme.vars.zIndex.appBar};
            backdrop-filter: blur(20px);
            display: flex;
            justify-content: space-between;
          `}
        >
          <IconButton onClick={() => setOpen(true)}>
            <SvgIcon>
              <IconMenu />
            </SvgIcon>
          </IconButton>

          <ThemeChangeButton />
        </Box>
        <Outlet />
      </Box>
    </>
  );
}

const VIEW_TRANSITION_HEADER = 'header-main';

function LayoutDesktop() {
  const theme = useTheme();
  const headerHeight = 72;

  return (
    <>
      <Global
        styles={css`
          /* Entry transition */
          ::view-transition-new(${VIEW_TRANSITION_HEADER}):only-child {
            animation: 0ms var(--motion-easing-decelerate) both fade-in;
            animation-delay: 600ms;
          }
          ::view-transition-old(${VIEW_TRANSITION_HEADER}) {
            animation: none;
          }
        `}
      />
      <Box
        css={css`
          position: sticky;
          top: 0;
          width: 100%;
          z-index: ${theme.vars.zIndex.appBar};
          backdrop-filter: blur(20px);
        `}
      >
        <Container>
          <Box
            gap={2}
            css={css`
              display: flex;
              justify-content: end;
              align-items: center;
              height: ${headerHeight}px;
            `}
          >
            <HeaderNavigation />
          </Box>
        </Container>
      </Box>
      <Box
        css={css`
          display: grid;
          grid-template-rows: 1fr auto;
          min-height: calc(100dvh - ${headerHeight}px);
        `}
      >
        <Outlet />

        <Box py={3} mt={8}>
          <FooterNavigation />
        </Box>
      </Box>
    </>
  );
}

export function LayoutMain() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return isMobile ? <LayoutMobile /> : <LayoutDesktop />;
}
