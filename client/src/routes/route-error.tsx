import { Box, Container, Typography } from '@mui/material';

export function RouteError() {
  return (
    <Container>
      <Box>
        <Typography variant="h2">404 </Typography>
        <Typography variant="h4" gutterBottom>
          You know what it means
        </Typography>
        <Typography variant="body1">
          If you thing it was caused by the error, I&apos;d really appreciate if you report this to
          me{' '}
        </Typography>
      </Box>
    </Container>
  );
}
