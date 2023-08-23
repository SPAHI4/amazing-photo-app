import { Box, Container, Typography } from '@mui/material';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function RouterErrorBoundary() {
  const error = useRouteError();

  if (!isRouteErrorResponse(error)) {
    throw error; // rethrow error to let the default error boundary handle it
  }

  return (
    <Container>
      <Box>
        <Typography variant="h2">
          {error.status} {error.statusText}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {error.data?.message ?? 'There was an error'}
        </Typography>
        <Typography variant="body1">
          If you thing it should be all right, I&apos;d really appreciate if you report this to me{' '}
        </Typography>
      </Box>
    </Container>
  );
}
