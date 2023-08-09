import { auth } from '@googleapis/gmail';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import open from 'open';
import * as os from 'node:os';
import * as fs from 'node:fs/promises';
import { JobHelpers, Logger } from 'graphile-worker';
import { v4 as uuidv4 } from 'uuid';
import type Mail from 'nodemailer/lib/mailer';
import { env } from '@app/config/env.ts';
import {
  EmailTemplateBaseProps,
  EmailTemplateStaticProps,
  EmailUser,
  renderTemplate,
} from './emails/email.tsx';

const previewEmail = async (message: Mail.Options) => {
  const filePath = `${os.tmpdir()}/${uuidv4()}.html`;
  const previewFile = await fs.open(filePath, 'w');
  const script = `
  <script>
    const str = atob("${Buffer.from(JSON.stringify(message)).toString('base64')}");
    console.log("nodemail payload:", JSON.parse(str));
  </script>
`;
  await previewFile.writeFile(`${message.html}${script}`, { encoding: 'utf-8' });
  await previewFile.close();
  await open(filePath);
};

const oAuth2Client = new auth.OAuth2(
  env.INSTALLED_GOOGLE_CLIENT_ID,
  env.INSTALLED_GOOGLE_CLIENT_SECRET,
  env.INSTALLED_GOOGLE_REDIRECT_URI,
);

oAuth2Client.setCredentials({
  refresh_token: env.GOOGLE_REFRESH_TOKEN,
});
export class UserEmailSender {
  private readonly logger: Logger;

  private readonly query: JobHelpers['query'];

  public constructor({ logger, query }: { logger: Logger; query: JobHelpers['query'] }) {
    this.logger = logger;
    this.query = query;
  }

  private userId: number | null = null;

  private generateUnsubscribeUrl() {
    const token = jwt.sign({ userId: this.userId }, env.JWT_SECRET_KEY, {
      expiresIn: '30d',
      algorithm: 'RS256',
    });

    return `${env.API_ORIGIN}/unsubscribe/${token}`;
  }

  private async getGmailTransport() {
    try {
      const { credentials } = await oAuth2Client.refreshAccessToken();

      const gmailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: env.ROBOT_EMAIL,
          clientId: env.INSTALLED_GOOGLE_CLIENT_ID,
          clientSecret: env.INSTALLED_GOOGLE_CLIENT_SECRET,
          refreshToken: credentials.refresh_token,
          accessToken: credentials.access_token,
        },
      } as nodemailer.TransportOptions);

      await gmailTransport.verify();

      return gmailTransport;
    } catch (error) {
      this.logger.error(`Error getting gmail transport: ${error}`);
      throw error;
    }
  }

  setUserId(userId: number) {
    this.userId = userId;

    return this;
  }

  private async fetchUserData(): Promise<EmailUser> {
    try {
      const {
        rows: [user],
      } = await this.query<{
        id: string;
        display_name: string;
        google_email: string;
        notified_at: Date;
        created_at: Date;
      }>(
        `
select
    u.id,
    u.display_name,
    ud.google_email,
    ud.notified_at,
    u.created_at
from
    app_public.users u
    join app_private.user_data ud on ud.user_id = u.id
where
    u.id = $1
`,
        [this.userId],
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user == null) {
        throw new Error(`User ${this.userId} not found`);
      }

      return {
        email: user.google_email,
        displayName: user.display_name,
        id: user.id,
      };
    } catch (error) {
      this.logger.error(`Error fetching user data: ${error}`);
      throw error;
    }
  }

  async send<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TTemplate extends React.FC<any> & EmailTemplateStaticProps,
    TProps extends Readonly<Omit<React.ComponentProps<TTemplate>, keyof EmailTemplateBaseProps>>,
  >(Template: TTemplate, props: TProps) {
    const gmailTransport = await this.getGmailTransport();
    const user = await this.fetchUserData();
    const unsubscribeUrl = this.generateUnsubscribeUrl();

    const baseProps: EmailTemplateBaseProps = {
      unsubscribeUrl,
      user,
    };

    const { html, subject } = await renderTemplate(Template, {
      ...props,
      ...baseProps,
    });

    const mailOptions: Mail.Options = {
      from: {
        name: env.APP_NAME,
        address: env.ROBOT_EMAIL,
      },
      to: user.email,
      replyTo: env.ADMIN_EMAIL,
      list: {
        unsubscribe: unsubscribeUrl,
      },
      subject,
      html,
    };

    if (env.NODE_ENV === 'development') {
      await previewEmail(mailOptions);

      mailOptions.to = {
        name: user.email,
        address: env.ADMIN_EMAIL,
      };
    }

    await gmailTransport.sendMail(mailOptions);
  }
}
