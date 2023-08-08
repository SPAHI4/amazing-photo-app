import { Box, Container, Link } from '@mui/material';
import { css } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

export function TermsOfService() {
  return (
    <div>
      <h2
        css={css`
          view-transition-name: header-istanbul-0;
        `}
      >
        TERMS OF SERVICE
      </h2>

      <h3>INTRODUCTION</h3>
      <p>
        Welcome to our website. If you continue to browse and use this website, you are agreeing to
        comply with and be bound by the following terms and conditions of use, which together with
        our privacy policy govern our relationship with you in relation to this website. If you
        disagree with any part of these terms and conditions, please do not use our website.
      </p>

      <h3>USE OF IMAGES (PHOTOS) FROM THIS WEBSITE</h3>
      <p>
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
      </p>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div>
      <h2>PRIVACY POLICY</h2>

      <h3>INTRODUCTION</h3>
      <p>
        We are committed to safeguarding the privacy of our website visitors. This policy sets out
        what will happen to personal information we collect from you or which you provide to us.
      </p>

      <h3>INFORMATION COLLECTED</h3>
      <p>We collect, store and use the following kinds of personal data:</p>
      <ul>
        <li>Personal information you provide (name, email, etc.)</li>
        <li>Login information if you create an account</li>
        <li>Technical data used when you visit our website</li>
        <li>User content that you post on our website</li>
      </ul>

      <h3>HOW WE USE YOUR INFORMATION</h3>
      <p>
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
      </p>

      <h3>LOGIN WITH GOOGLE</h3>
      <p>
        You can choose to login with Google. When you do so, Google will share with us certain
        profile information that you have authorized. This information is used for authentication
        purposes and is governed by our Privacy Policy.
      </p>

      <h3>USER CONTENT</h3>
      <p>
        When you upload or submit content to our website, you grant us the rights to use, reproduce,
        display, modify, delete from, add to, prepare derivative works of, and/or distribute that
        User Content in connection with the site, and in our sole discretion.
      </p>

      <h3>COOKIES AND TRACKING</h3>
      <p>
        We use cookies and similar tracking technology to track the activity on our Service and hold
        certain information. Cookies are files with small amount of data which may include an
        anonymous unique identifier.
      </p>

      <h3>DATA STORAGE AND SECURITY</h3>
      <p>
        All data collected is securely stored and protected by industry-standard methods. We take
        precautions, including administrative, technical, and physical measures to safeguard your
        personal data against loss, theft, and misuse, as well as against unauthorized access,
        disclosure, alteration, and destruction.
      </p>

      <h3>DMCA (DIGITAL MILLENNIUM COPYRIGHT ACT).</h3>
      <p>
        We respect other&apos;s intellectual property rights. If you believe any of the
        User-Generated Content infringes upon your intellectual property rights, please submit a
        notification alleging such infringement (DMCA Takedown Notice) with detailed information
        regarding the alleged infringement.
      </p>

      <h3>DATA PROCESSING AGREEMENT.</h3>
      <p>
        Third-party services may be used to enhance various features of our website. If these
        third-party services process personal data on our behalf, we&apos;ve entered into a Data
        Processing Agreement with them that complies with GDPR and other applicable laws and
        regulations.
      </p>

      <h3>CHANGES TO PRIVACY POLICY</h3>
      <p>
        We reserve the right to make changes to our web privacy policy at any time without prior
        consultation; these changes will be immediately applicable and binding.
      </p>

      <h3>CONTACT INFORMATION</h3>
      <p>
        If you have any questions about our Privacy Policy, please contact us at:{' '}
        <Link href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>
          {import.meta.env.VITE_CONTACT_EMAIL}
        </Link>
      </p>
    </div>
  );
}

export function RouteLegal() {
  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} / Legal information</title>
      </Helmet>
      <Container>
        <Box py={4} gap={2} display="grid">
          <div>
            <h1>Legal information</h1>
            <p>LAST UPDATED: 03 August, 2023.</p>
          </div>
          <TermsOfService />
          <PrivacyPolicy />
        </Box>
      </Container>
    </>
  );
}
