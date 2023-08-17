import { Box, Button, Menu, MenuItem, SvgIcon } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { css } from '@emotion/react';
import useTheme from '@mui/material/styles/useTheme';
import { IconExpandMore } from '../icons.tsx';
import { ThemeChangeButton } from './theme-change-button.tsx';
import { useCurrentUser, useLogout } from '../hooks/use-user.ts';
import { StickPointerButton } from '../ui-components/cursor.tsx';
import { useAppGoogleLogin } from '../hooks/use-app-google-login.tsx';

export function HeaderNavigation() {
  const theme = useTheme();
  const [login, { loading: loginLoading }] = useAppGoogleLogin();
  const [currentUser] = useCurrentUser();
  const [logout, { loading: logoutLoading }] = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <Box
      display="flex"
      gap={1}
      alignItems="center"
      css={css`
        position: relative;
      `}
    >
      <StickPointerButton>
        <Button component={Link} to="/" color="inherit" variant="text">
          main page
        </Button>
      </StickPointerButton>
      <StickPointerButton>
        <Button
          component="a"
          href={import.meta.env.VITE_GITHUB_URL}
          target="_blank"
          color="inherit"
          variant="text"
        >
          app on github
        </Button>
      </StickPointerButton>
      {currentUser == null && import.meta.env.DEV && (
        <StickPointerButton key="login">
          <LoadingButton loading={loginLoading} variant="text" color="inherit" onClick={login}>
            login
          </LoadingButton>
        </StickPointerButton>
      )}
      {currentUser != null && (
        <>
          <StickPointerButton key="user">
            <LoadingButton
              loading={logoutLoading}
              variant="text"
              color="inherit"
              endIcon={
                <SvgIcon>
                  <IconExpandMore />
                </SvgIcon>
              }
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
            >
              {currentUser.displayName}
            </LoadingButton>
          </StickPointerButton>
          <Menu
            open={open}
            anchorEl={anchorEl}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            onClose={() => {
              setAnchorEl(null);
            }}
            disableScrollLock
            css={css`
              & .MuiPaper-root {
                padding: 12px 4px;
                border-radius: 0;
                background: transparent;
                backdrop-filter: blur(20px);
                box-shadow: none;
                border: 1px ${theme.vars.palette.divider} solid;
              }
            `}
          >
            {currentUser.role === 'APP_ADMIN' && (
              <StickPointerButton>
                <MenuItem component={Link} to="/admin/locations/">
                  admin panel
                </MenuItem>
              </StickPointerButton>
            )}
            {import.meta.env.VITE_UPLOAD_ENABLED === 'true' && (
              <StickPointerButton>
                <MenuItem component={Link} to="/upload">
                  upload
                </MenuItem>
              </StickPointerButton>
            )}
            <StickPointerButton>
              <MenuItem onClick={logout}>logout</MenuItem>
            </StickPointerButton>
          </Menu>
        </>
      )}
      <ThemeChangeButton />
    </Box>
  );
}
