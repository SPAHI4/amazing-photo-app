import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Container, Skeleton, Tab, Tabs } from '@mui/material';
import { Suspense, useLayoutEffect } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import { HeaderNavigation } from './header-navigation.tsx';
import { useCurrentUser } from '../hooks/use-user.ts';

export function LayoutAdmin() {
  const location = useLocation();
  const theme = useTheme();
  const [currentUser] = useCurrentUser();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (currentUser?.role !== 'APP_ADMIN') {
      navigate('/');
    }
  }, [currentUser?.role, navigate]);

  return (
    <div
      css={css`
        display: grid;
        min-height: 100vh;
        grid-template-rows: auto 1fr;
        gap: 24px;
      `}
    >
      <Container>
        <div
          css={css`
            display: grid;
            justify-content: end;
            padding: 16px 0;
          `}
        >
          <HeaderNavigation />
        </div>
        <Tabs
          value={location.pathname}
          css={css`
            & .MuiTabs-indicator {
              display: flex;
              justify-content: center;
              background-color: transparent;
              height: 3px;
              border-radius: 10px;
            }

            & .MuiTabs-indicatorSpan {
              max-width: 40px;
              width: 100%;
              border-radius: 10px;
              background-color: ${theme.vars.palette.primary.main};
            }
          `}
          TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        >
          <Tab value="/admin/locations/" component={Link} to="locations/" label="Locations" />
          <Tab value="/admin/photos/" component={Link} to="photos/" label="Photos" />
          <Tab value="/admin/comments/" component={Link} to="comments/" label="Comments" />
          <Tab value="/admin/users/" component={Link} to="users/" label="Users" />
        </Tabs>
      </Container>

      <Suspense
        fallback={
          <Container>
            <Skeleton width="100%" height="80vh" />
          </Container>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
