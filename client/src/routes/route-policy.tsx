import { Box, Container, Link, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

function PrivacyPolicy() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        INTRODUCTION
      </Typography>
      <Typography paragraph>
        We are committed to safeguarding the privacy of our website visitors. This policy sets out
        what will happen to personal information we collect from you or which you provide to us.
      </Typography>

      <Typography variant="h5" gutterBottom>
        INFORMATION COLLECTED
      </Typography>
      <Typography paragraph>
        We collect, store and use the following kinds of personal data:
      </Typography>
      <ul>
        <li>Personal information you provide (name, email, etc.)</li>
        <li>Login information if you create an account</li>
        <li>Technical data used when you visit our website</li>
        <li>User content that you post on our website</li>
      </ul>

      <Typography variant="h5" gutterBottom>
        HOW WE USE YOUR INFORMATION
      </Typography>
      <Typography paragraph>
        We may use the information we collect for any of the following purposes:
        <ul>
          <li>To provide, support and improve our services.</li>
          <li>
            To communicate with you about your use of our service, including order confirmations,
            invoices, technical notices, updates and security alerts.
          </li>
          <li>To respond to your queries and requests.</li>
          <li>To comply with our legal obligations and enforce our agreements.</li>
          <li>
            To protect the security of our services, prevent fraud and other potentially illegal
            activities.
          </li>
        </ul>
      </Typography>

      <Typography variant="h5" gutterBottom>
        LOGIN WITH GOOGLE
      </Typography>
      <Typography paragraph>
        You can choose to login with Google. When you do so, Google will share with us certain
        profile information that you have authorized. This information is used for authentication
        purposes and is governed by our Privacy Policy.
      </Typography>

      <Typography variant="h5" gutterBottom>
        USER CONTENT
      </Typography>
      <Typography paragraph>
        When you upload or submit content to our website, you grant us the rights to use, reproduce,
        display, modify, delete from, add to, prepare derivative works of, and/or distribute that
        User Content in connection with the site, and in our sole discretion.
      </Typography>

      <Typography variant="h5" gutterBottom>
        COOKIES AND TRACKING
      </Typography>
      <Typography paragraph>
        We use cookies and similar tracking technology to track the activity on our Service and hold
        certain information. Cookies are files with small amount of data which may include an
        anonymous unique identifier.
      </Typography>

      <Typography variant="h5" gutterBottom>
        DATA STORAGE AND SECURITY
      </Typography>
      <Typography paragraph>
        All data collected is securely stored and protected by industry-standard methods. We take
        precautions, including administrative, technical, and physical measures to safeguard your
        personal data against loss, theft, and misuse, as well as against unauthorized access,
        disclosure, alteration, and destruction.
      </Typography>

      <Typography variant="h5" gutterBottom>
        DMCA (DIGITAL MILLENNIUM COPYRIGHT ACT).
      </Typography>
      <Typography paragraph>
        We respect other&apos;s intellectual property rights. If you believe any of the
        User-Generated Content infringes upon your intellectual property rights, please submit a
        notification alleging such infringement (DMCA Takedown Notice) with detailed information
        regarding the alleged infringement.
      </Typography>

      <Typography variant="h5" gutterBottom>
        DATA PROCESSING AGREEMENT.
      </Typography>
      <Typography paragraph>
        Third-party services may be used to enhance various features of our website. If these
        third-party services process personal data on our behalf, we&apos;ve entered into a Data
        Processing Agreement with them that complies with GDPR and other applicable laws and
        regulations.
      </Typography>

      <Typography variant="h5" gutterBottom>
        CHANGES TO PRIVACY POLICY
      </Typography>
      <Typography paragraph>
        We reserve the right to make changes to our web privacy policy at any time without prior
        consultation; these changes will be immediately applicable and binding.
      </Typography>

      <Typography variant="h5" gutterBottom>
        CONTACT INFORMATION
      </Typography>
      <Typography paragraph>
        If you have any questions about our Privacy Policy, please contact us at:{' '}
        <Link href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>
          {import.meta.env.VITE_CONTACT_EMAIL}
        </Link>
      </Typography>
    </Box>
  );
}

export function RoutePolicy() {
  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} / Legal information</title>
      </Helmet>
      <Container>
        <Box py={4} gap={2} display="grid">
          <Box>
            <Typography variant="h2" gutterBottom>
              Privacy policy
            </Typography>
            <Typography paragraph>LAST UPDATED: 03 August, 2023.</Typography>
          </Box>
          <PrivacyPolicy />
        </Box>
      </Container>
    </>
  );
}
