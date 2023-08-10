import cookie from 'cookie';
import { PoolClient } from 'pg';
import { IncomingMessage, ServerResponse } from 'node:http';
import { REFRESH_TOKEN_EXPIRATION_DAYS } from './oauth.js';

type UserRole = 'app_user' | 'app_admin';

type PgRole = 'app_anonymous' | 'app_user' | 'app_admin';

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
  const clientIp =
    req.headers['true-client-ip']?.[0] ??
    req.headers['x-forwarded-for']?.[0] ??
    req.socket.remoteAddress ??
    '';

  return {
    getRefreshTokenCookie: () => {
      const cookies = cookie.parse(req.headers.cookie ?? '');
      return cookies.refreshToken;
    },
    setRefreshTokenCookie: (token: string) => {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', token, {
          httpOnly: true,
          path: '/graphql',
          maxAge: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRATION_DAYS,
          secure: false,
          domain: 'localhost',
        }),
      );
    },
    cleanCookies: () => {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', '', {
          httpOnly: true,
          path: '/graphql',
          maxAge: 0,
          secure: false,
          domain: 'localhost',
        }),
      );
    },
    clientIp,
  };
};
