import { Box, Container, Link, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export function TermsOfService() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        INTRODUCTION
      </Typography>
      <Typography variant="body1">
        Welcome to our website. If you continue to browse and use this website, you are agreeing to
        comply with and be bound by the following terms and conditions of use, which together with
        our privacy policy govern our relationship with you in relation to this website. If you
        disagree with any part of these terms and conditions, please do not use our website.
      </Typography>

      <Typography variant="h5" gutterBottom marginTop={3}>
        USE OF IMAGES (PHOTOS) FROM THIS WEBSITE
      </Typography>
      <Typography variant="body1">
        Unless otherwise stated, all photos that appear on this site are the property of{' '}
        {import.meta.env.VITE_CONTACT_NAME}. These photos may be used for non-commercial purposes,
        but you must attribute them to us by stating &quot;Image courtesy of{' '}
        {import.meta.env.VITE_CONTACT_NAME}&quot; or provide a link back to our website. This
        license does not permit the redistribution of our photos, the creation of derivative works,
        or their use for commercial purposes. If you are interested in using a photo for a
        commercial purpose, or if you have any questions about using our photos, please reach out to
        us at{' '}
        <Link href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>
          {import.meta.env.VITE_CONTACT_EMAIL}
        </Link>
        .
      </Typography>
    </Box>
  );
}

export function RouteTerms() {
  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} / Legal information</title>
      </Helmet>
      <Container>
        <Box py={4} gap={2} display="grid">
          <div>
            <Typography variant="h2">Terms of service</Typography>
            <Typography variant="body1">LAST UPDATED: 03 August, 2023.</Typography>
          </div>
          <TermsOfService />
        </Box>
      </Container>
    </>
  );
}
