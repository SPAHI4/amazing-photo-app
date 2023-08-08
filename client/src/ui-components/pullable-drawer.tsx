import { css } from '@emotion/react';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';

const drawerBleeding = 56;

interface PullableDrawerProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export function PullableDrawer({ children, title }: PullableDrawerProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const container = window.document.body;

  return (
    <SwipeableDrawer
      container={container}
      anchor="bottom"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      swipeAreaWidth={drawerBleeding}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      css={css`
        .MuiPaper-root {
          height: calc(90% - ${drawerBleeding}px);
          overflow: visible;
        }
      `}
    >
      <Box
        css={css`
          position: absolute;
          top: -${drawerBleeding}px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          visibility: visible;
          right: 0;
          left: 0;
          background-color: ${theme.palette.mode === 'light' ? '#fff' : grey[800]};
        `}
      >
        <Box
          css={css`
            width: 30px;
            height: 6px;
            background-color: ${theme.palette.mode === 'light' ? grey[300] : grey[900]};
            border-radius: 3px;
            position: absolute;
            top: 8px;
            left: calc(50% - 15px);
          `}
        />
        <Typography
          css={css`
            padding: ${theme.spacing(2)};
            color: ${theme.palette.text.secondary};
          `}
        >
          {title}
        </Typography>
      </Box>
      <Box
        px={2}
        pb={2}
        css={css`
          height: 100%;
          overflow: auto;
          background-color: ${theme.palette.mode === 'light' ? '#fff' : grey[800]};
          position: relative;
        `}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
}
