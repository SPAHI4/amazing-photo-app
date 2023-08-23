import { css } from '@emotion/react';
import { Box, Button, Container, Typography } from '@mui/material';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  componentStack: string;
}

export function ErrorFallback({ error, resetError, componentStack }: ErrorFallbackProps) {
  return (
    <div
      css={css`
        height: 100dvh;
        display: grid;
        place-items: center;
        padding: 48px 0;
      `}
    >
      <Container>
        <Typography variant="h6" gutterBottom>
          Oops, something went wrong...
        </Typography>
        <Box
          gap={2}
          css={css`
            display: flex;
          `}
        >
          <Button onClick={resetError} variant="outlined">
            Try again
          </Button>
          <Button component="a" href={`mailto:${import.meta.env.VITE_EMAIL}`}>
            Contact me
          </Button>
        </Box>

        {import.meta.env.DEV && (
          <>
            <pre>{error.message}</pre>
            <pre>{componentStack}</pre>
            <pre>{error.stack}</pre>
          </>
        )}
      </Container>
    </div>
  );
}
