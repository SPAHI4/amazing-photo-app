import { Box, Button, Container } from '@mui/material';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { StickPointerButton } from '../ui-components/cursor.tsx';

export function FooterNavigation() {
  return (
    <Container
      css={css`
        display: flex;
        justify-content: space-between;
      `}
    >
      <Box
        gap={2}
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <span>meet me on</span>
        <StickPointerButton>
          <Button
            component="a"
            href={import.meta.env.VITE_TELEGRAM_URL}
            color="inherit"
            target="_blank"
            css={css`
              &:not(:hover) {
                text-decoration: underline;
              }
            `}
          >
            telegram
          </Button>
        </StickPointerButton>
        <StickPointerButton>
          <Button
            component="a"
            href={import.meta.env.VITE_INSTAGRAM_URL}
            color="inherit"
            target="_blank"
            css={css`
              &:not(:hover) {
                text-decoration: underline;
              }
            `}
          >
            instagram
          </Button>
        </StickPointerButton>
      </Box>
      <Box
        gap={1}
        css={css`
          display: flex;
        `}
      >
        <StickPointerButton>
          <Button
            component={Link}
            to="/terms-of-service"
            color="inherit"
            css={css`
              &:not(:hover) {
                text-decoration: underline;
              }
            `}
          >
            terms of service
          </Button>
        </StickPointerButton>
        <StickPointerButton>
          <Button
            component={Link}
            to="/privacy-policy"
            color="inherit"
            css={css`
              &:not(:hover) {
                text-decoration: underline;
              }
            `}
          >
            privacy policy
          </Button>
        </StickPointerButton>
      </Box>
    </Container>
  );
}
