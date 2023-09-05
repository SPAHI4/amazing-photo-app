import cookie from 'cookie';
import { PoolClient } from 'pg';
import { IncomingMessage, ServerResponse } from 'node:http';
import { env } from '@app/config/env.js';
import { REFRESH_TOKEN_EXPIRATION_DAYS } from './oauth.js';

type UserRole = 'app_user' | 'app_admin';

type PgRole = 'app_anonymous' | 'app_user' | 'app_admin';

declare module 'http' {
  interface CompatFastifyRequest {
    pgClient?: PoolClient;
  }
}

interface JwtClaims {
  user_id: number;
  role: UserRole;
}

export interface GraphqlContext {
  getRefreshTokenCookie: () => string | undefined;
  setRefreshTokenCookie: (token: string) => void;
  cleanCookies: () => void;
  clientIp: string;
  jwtClaims: JwtClaims | null;
  pgRole: PgRole;
  pgClient: PoolClient;
}

export const getGraphqlContext = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<Partial<GraphqlContext>> => {
  const getIp = (header: string | string[] | undefined): string | null =>
    Array.isArray(header) ? header[0] : header ?? null;

  const clientIp: string =
    getIp(req.headers['cf-connecting-ip']) ??
    getIp(req.headers['x-forwarded-for']) ??
    req.socket.remoteAddress ??
    '';

  const context: Partial<GraphqlContext> = {
    getRefreshTokenCookie: () => {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      return cookies.refreshToken;
    },
    setRefreshTokenCookie: (token: string) => {
      res.setHeader(
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
    },
    cleanCookies: () => {
      res.setHeader(
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
    },
    clientIp,
  };

  // for tests
  // eslint-disable-next-line no-underscore-dangle
  if (req._fastifyRequest?.pgClient != null) {
    // eslint-disable-next-line no-underscore-dangle
    context.pgClient = req._fastifyRequest.pgClient;
  }

  return context;
};
