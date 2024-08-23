import { PoolClient } from 'pg';

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
