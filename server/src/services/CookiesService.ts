import cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'node:http';
import { env } from '@app/config/env.js';
import { REFRESH_TOKEN_EXPIRATION_DAYS } from '../oauth.js';

export class CookieService {
  constructor(
    private req: IncomingMessage,
    private res: ServerResponse,
  ) {}

  getRefreshTokenCookie(): string | undefined {
    const cookies = cookie.parse(this.req.headers.cookie ?? '');
    return cookies.refreshToken;
  }

  setRefreshTokenCookie(token: string): void {
    this.res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', token, {
        httpOnly: true,
        secure: true,
        path: '/graphql',
        maxAge: 1000 * 60 * 60 * 24 * REFRESH_TOKEN_EXPIRATION_DAYS,
        domain: env.ROOT_DOMAIN,
        sameSite: 'lax',
      }),
    );
  }

  cleanCookies(): void {
    this.res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', '', {
        httpOnly: true,
        secure: true,
        path: '/graphql',
        maxAge: 0,
        domain: env.ROOT_DOMAIN,
        sameSite: 'lax',
      }),
    );
  }
}
