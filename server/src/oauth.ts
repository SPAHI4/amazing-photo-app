import { OAuth2Client } from 'google-auth-library';
import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import crypto from 'crypto';
import { env } from '@app/config/env.js';
import { GraphqlContext } from './types/GraphQLContext.js';

export enum TokenErrors {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_NOT_ACTIVE = 'TOKEN_NOT_ACTIVE',
  REFRESH_TOKEN_EMPTY = 'REFRESH_TOKEN_EMPTY',
}

interface RefreshTokenPayload {
  userId: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export const REFRESH_TOKEN_EXPIRATION_DAYS = 30;

export const encryptForDatabase = (text: string) =>
  crypto.privateEncrypt(env.JWT_SECRET_KEY, Buffer.from(text)).toString('base64');

export const decryptFromDatabase = (text: string) =>
  crypto.publicDecrypt(env.JWT_PUBLIC_KEY, Buffer.from(text, 'base64')).toString();

export const getTokenHash = (token: string) =>
  crypto.createHash('shake256', { outputLength: 8 }).update(token).digest('hex');

export const verifyAndUpdateTokenSession = async (
  token: string,
  { pgClient, clientIp }: GraphqlContext,
) => {
  try {
    const payload = jwt.verify(token, env.JWT_PUBLIC_KEY) as RefreshTokenPayload;

    const {
      rows: [existingToken],
    } = await pgClient.query(
      `
      select
          *
      from
          app_private.sessions
      where
          user_id = $1
          and token_hash = $2
          and token_revoked_at is null
      `,
      [payload.userId, getTokenHash(token)],
    );

    if (existingToken == null) {
      throw new Error();
    }

    await pgClient.query(
      `
      update
          app_private.sessions
      set
          last_seen_ip = $1
      where
          id = $2
      `,
      [clientIp, existingToken.id],
    );

    return payload;
  } catch (err) {
    throw new GraphQLError('Token is revoked or invalid', null, null, null, null, null, {
      code: TokenErrors.TOKEN_INVALID,
    });
  }
};

export const createTokenSession = async (
  userId: string,
  { pgClient, clientIp }: Pick<GraphqlContext, 'pgClient' | 'clientIp'>,
) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET_KEY, {
    algorithm: 'RS256',
    expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d`,
  });

  await pgClient.query(
    `
insert into app_private.sessions (user_id, token_expires_at, token_hash, last_seen_ip, logged_in_ip)
    values ($1, now() + interval '${REFRESH_TOKEN_EXPIRATION_DAYS} days', $2, $3, $3)
`,
    [userId, getTokenHash(token), clientIp],
  );

  return token;
};

export const getAccessToken = async (
  userId: string,
  { pgClient }: Pick<GraphqlContext, 'pgClient'>,
) => {
  // TODO: remove this as side effect
  await pgClient.query(`set local jwt.claims.user_id to ${userId}`);

  const {
    rows: [accessToken],
  } = await pgClient.query(`
      select *
      from app_private.access_token()
  `);

  return accessToken;
};

const handleAdminUser = async (userId: string, { pgClient }: GraphqlContext) => {
  const {
    rows: [user],
  } = await pgClient.query(
    `
      select
          email
      from
          app_hidden.user_data
      where
          user_id = $1
      `,
    [userId],
  );

  if (user.email === env.ADMIN_EMAIL) {
    await pgClient.query(
      `
      update
          app_public.users
      set
          role = 'app_admin'
      where
          id = $1
`,
      [userId],
    );
  }
};

const handleArchivedUser = async (userId: string, { pgClient }: GraphqlContext) => {
  const {
    rows: [user],
  } = await pgClient.query(
    `
select
    id,
    is_archived
from
    app_public.users
where
    id = $1
`,
    [userId],
  );

  if (user.is_archived === true) {
    throw new GraphQLError('User is blocked', null, null, null, null, null, {
      code: 'USER_BLOCKED',
    });
  }
};

export const loginWithGoogleMutation = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input LoginWithGoogleInput {
      code: String!
      toCookie: Boolean
    }
    type LoginWithGooglePayload {
      accessToken: JwtToken!
      refreshToken: String
      user: User!
    }
    input GetAccessTokenInput {
      refreshToken: String
      fromCookie: Boolean
    }
    type GetAccessTokenPayload {
      accessToken: JwtToken!
    }
    input LogoutInput {
      refreshToken: String
      fromCookie: Boolean
    }
    extend type Mutation {
      loginWithGoogle(input: LoginWithGoogleInput!): LoginWithGooglePayload!
      getAccessToken(input: GetAccessTokenInput!): GetAccessTokenPayload!
      logout(input: LogoutInput!): Boolean!
    }
  `,
  resolvers: {
    Mutation: {
      /**
       * curl -X POST -H "Content-Type: application/json" "Cookies: refreshToken=..."
       * -d '{"query": "mutation { getAccessToken(input: { fromCookie: true }) { accessToken } }"}'
       *
       * {
       *  "data": {
       *    "getAccessToken": {
       *     "accessToken": "..."
       *     }
       *    }
       *  }
       */
      getAccessToken: async (_query, { input }, context: GraphqlContext) => {
        const { pgClient } = context;
        await pgClient.query('savepoint graphql_mutation');
        await pgClient.query('set local role app_postgraphile');

        try {
          const refreshToken =
            input.fromCookie === true ? context.getRefreshTokenCookie() : input.refreshToken;

          if (refreshToken == null) {
            throw new GraphQLError('No refresh token provided', null, null, null, null, null, {
              code: TokenErrors.REFRESH_TOKEN_EMPTY,
            });
          }

          const payload = await verifyAndUpdateTokenSession(refreshToken, context);

          const accessToken = await getAccessToken(payload.userId, context);

          await handleArchivedUser(payload.userId, context);

          return {
            accessToken,
          };
        } catch (err) {
          context.cleanCookies();
          throw err;
        }
      },
      logout: async (_query, { input }, context: GraphqlContext) => {
        const { pgClient } = context;
        await pgClient.query('savepoint graphql_mutation');
        await pgClient.query('set local role app_postgraphile');

        const refreshToken =
          input.fromCookie === true ? context.getRefreshTokenCookie() : input.refreshToken;

        if (refreshToken == null) {
          throw new GraphQLError('No refresh token provided', null, null, null, null, null, {
            code: TokenErrors.REFRESH_TOKEN_EMPTY,
          });
        }

        verifyAndUpdateTokenSession(refreshToken, context);

        await pgClient.query(
          `
            update
                app_private.sessions
            set
                token_revoked_at = now()
            where
                token_hash = $1
            `,
          [getTokenHash(refreshToken)],
        );

        if (input.fromCookie === true) {
          context.cleanCookies();
        }

        await pgClient.query('release savepoint graphql_mutation');

        return true;
      },
      /**
       * curl -X POST -H "Content-Type: application/json" -d '
       * {"query": "mutation { loginWithGoogle(input: { code: "...", toCookie: true }) { accessToken refreshToken } }"}'
       *
       * {
       * "data": {
       *  "loginWithGoogle": {
       *    "accessToken": "...",
       *    }
       *  }
       * }
       *
       * set-cookie refreshToken=...
       */
      loginWithGoogle: async (_query, { input: { code, toCookie } }, context: GraphqlContext) => {
        const { pgClient } = context;

        const oAuth2Client = new OAuth2Client(
          env.WEB_GOOGLE_CLIENT_ID,
          env.WEB_GOOGLE_CLIENT_SECRET,
          'postmessage',
        );

        const { tokens } = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(tokens);

        if (tokens.refresh_token == null) {
          throw new Error('No refresh token received from Google');
        }

        const googleRefreshToken = encryptForDatabase(tokens.refresh_token);
        const { data } = await oAuth2Client.request<GoogleUser>({
          url: 'https://www.googleapis.com/oauth2/v1/userinfo',
        });

        await pgClient.query('savepoint graphql_mutation');
        await pgClient.query('set local role app_postgraphile');

        const {
          rows: [user],
        } = await pgClient.query(
          `
              select
                  *
              from
                  app_private.upsert_user 
                    (google_id := $1, google_email := $2, 
                    google_refresh_token := $3, google_picture_url := $4, google_name := $5, google_given_name := $6, google_family_name := $7, google_locale := $8, google_verified_email := $9)
              `,
          [
            data.id,
            data.email,
            googleRefreshToken,
            data.picture,
            data.name,
            data.given_name,
            data.family_name,
            data.locale,
            data.verified_email,
          ],
        );

        await handleAdminUser(user.id, context);

        await handleArchivedUser(user.id, context);

        const [refreshToken, accessToken] = await Promise.all([
          createTokenSession(user.id, context),
          getAccessToken(user.id, context),
        ]);

        await pgClient.query('release savepoint graphql_mutation');

        if (toCookie === true) {
          context.setRefreshTokenCookie(refreshToken);
          return {
            accessToken,
            user,
          };
        }

        return {
          accessToken,
          refreshToken,
          user,
        };
      },
    },
  },
}));
