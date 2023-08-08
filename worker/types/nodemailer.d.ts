import { SMTPTransport } from 'nodemailer';

declare module 'nodemailer' {
  export interface TransportOptions extends SMTPTransport.Options {
    service: 'gmail';
    auth: {
      type: 'OAuth2';
      user: string;
      clientId: string;
      clientSecret: string;
      refreshToken: string | null | undefined;
      accessToken: string | null | undefined;
    };
  }
}
