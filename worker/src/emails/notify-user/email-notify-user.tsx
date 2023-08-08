import { Button } from '@react-email/button';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Head } from '@react-email/head';
import { Tailwind } from '@react-email/tailwind';
import { Heading } from '@react-email/heading';
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { env } from '@app/config/env.ts';
import type { EmailTemplateBaseProps, EmailTemplateComponent, EmailUser } from '../email.tsx';
import type { DbPhotosComments, DbPhotosLikes } from '../../tasks/notify-user.ts';

interface EmailNotifyUserProps extends EmailTemplateBaseProps {
  user: EmailUser;
  unsubscribeUrl: string;
  photosLikedSince: DbPhotosLikes[];
  photosCommentedSince: DbPhotosComments[];
}

// eslint-disable-next-line react/function-component-definition
export const EmailNotifyUser: EmailTemplateComponent<EmailNotifyUserProps> = (props) => {
  const { photosLikedSince, photosCommentedSince, unsubscribeUrl } = props;

  return (
    <Html lang="en">
      <Head>
        <title>You are getting attention!</title>
      </Head>
      <Tailwind>
        <Heading as="h2">You are getting attention!</Heading>
        <Hr />

        {photosLikedSince.length > 0 && (
          <>
            <Heading as="h4">New likes on your photos</Heading>
            {photosLikedSince.map((photo) => {
              const source = photo.sources.find((s) => s.size === 480 && s.type === 'image/jpeg');

              if (source == null) {
                return null;
              }

              const src = `https://${photo.s3_bucket}.s3.amazonaws.com/${source.s3_key}`;

              return (
                <Section key={photo.id}>
                  <Column style={{ width: 100 }}>
                    <Img src={src} height="100" />
                  </Column>
                  <Column align="left">
                    <Text>
                      <strong>{photo.likes_count}</strong> new{' '}
                      {photo.likes_count === 1 ? 'like' : 'likes'}
                    </Text>
                    <Button href={`${env.WEB_ORIGIN}/location/${photo.location_slug}/${photo.id}`}>
                      View
                    </Button>
                  </Column>
                </Section>
              );
            })}
          </>
        )}

        {photosCommentedSince.length > 0 && (
          <>
            <Heading as="h4">New comments on your photos</Heading>
            {photosCommentedSince.map((photo) => {
              const source = photo.sources.find((s) => s.size === 480 && s.type === 'image/jpeg');

              if (source == null) {
                return null;
              }

              const src = `https://${photo.s3_bucket}.s3.amazonaws.com/${source.s3_key}`;

              return (
                <Section key={photo.id}>
                  <Column style={{ width: 100 }}>
                    <Img src={src} height="100" />
                  </Column>
                  <Column align="left">
                    <Text>
                      <strong>{photo.comments_count}</strong> new{' '}
                      {photo.comments_count === 1 ? 'comment' : 'comments'}
                    </Text>
                    <Button href={`${env.WEB_ORIGIN}/location/${photo.location_slug}/${photo.id}`}>
                      View
                    </Button>
                  </Column>
                </Section>
              );
            })}
          </>
        )}

        <Section className="pt-2">
          <Hr />
          <Link href={unsubscribeUrl}>Unsubscribe</Link>
        </Section>
      </Tailwind>
    </Html>
  );
};

EmailNotifyUser.metaUrl = import.meta.url;

EmailNotifyUser.subject = (props) =>
  `Something new after your last visit, ${props.user.displayName}`;
