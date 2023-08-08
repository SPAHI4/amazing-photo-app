import { List, ListItem, ListItemButton, ListItemText, SwipeableDrawer } from '@mui/material';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useCurrentUser, useLogout } from '../hooks/use-user.ts';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}
export function MobileDrawer({ open, onClose, onOpen }: MobileDrawerProps) {
  const [currentUser] = useCurrentUser();
  const [logout, { loading: logoutLoading }] = useLogout();

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      css={css`
        .MuiDrawer-paper {
          background-color: transparent;
          backdrop-filter: blur(20px) brightness(2);
          display: grid;
          align-content: space-between;
          height: 100dvh;
        }
      `}
    >
      <List>
        {currentUser != null && (
          <>
            <ListItem>
              <ListItemText primary={currentUser.displayName} secondary="logged as" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  logout();
                }}
                disabled={logoutLoading}
              >
                <ListItemText>logout</ListItemText>
              </ListItemButton>
            </ListItem>
          </>
        )}
        {import.meta.env.VITE_UPLOAD_ENABLED === 'true' && currentUser != null && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/upload">
              <ListItemText>upload</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        {currentUser?.role === 'APP_ADMIN' && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/locations/">
              <ListItemText>admin panel</ListItemText>
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText>main page</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>

      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href={import.meta.env.VITE_GITHUB_URL} target="_blank">
            <ListItemText>app on github</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href={import.meta.env.VITE_INSTAGRAM_URL} target="_blank">
            <ListItemText>me on instagram</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href={import.meta.env.VITE_TELEGRAM_URL} target="_blank">
            <ListItemText>me on telegram</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/legal" target="_blank">
            <ListItemText>legal information</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}
