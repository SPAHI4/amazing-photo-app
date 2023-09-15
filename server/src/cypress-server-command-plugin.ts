/* eslint-disable no-case-declarations */
import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '@app/config/env.js';
import { createTokenSession, GoogleUser } from './oauth.js';
import { PgClient } from './pg-client.js';

type CypressServerCommand = {
  Body: { command: 'loginWithGoogle' };
  Reply: {
    refreshToken: string;
    accessToken: string;
  };
};

async function loginWithGoogle(pgClient: PgClient) {
  const testUser = {
    id: 'testUserID',
    email: 'testuser@gmail.com',
    verified_email: true,
    name: 'Test User',
    given_name: 'Test',
    family_name: 'User',
    picture: 'https://example.com/testuser.jpg',
    locale: 'en',
  } satisfies GoogleUser;

  const {
    rows: [user],
  } = await pgClient.query(
    `
      select
          *
      from
          app_private.upsert_user (google_id := $1, google_email := $2, google_refresh_token := $3, google_picture_url := $4, google_name := $5, google_given_name := $6, google_family_name := $7, google_locale := $8, google_verified_email := $9)
    `,
    [
      testUser.id,
      testUser.email,
      '',
      testUser.picture,
      testUser.name,
      testUser.given_name,
      testUser.family_name,
      testUser.locale,
      testUser.verified_email,
    ],
  );

  const refreshToken = await createTokenSession(user.id, {
    pgClient: pgClient.connection!,
    clientIp: '0.0.0.0',
  });
  const accessToken = jwt.sign(
    {
      user_id: user.id,
      role: 'app_user',
    },
    env.JWT_SECRET_KEY,
    {
      expiresIn: '15m',
      audience: 'postgraphile',
      algorithm: 'RS256',
    },
  );

  return { refreshToken, accessToken };
}

export const cypressServerCommandPlugin: FastifyPluginAsync = async (app) => {
  app.post<CypressServerCommand>('/cypress-server-command', async (req, reply) => {
    const { command } = req.body;
    await using pgClient = new PgClient(app.log);
    await pgClient.startTransaction();

    await pgClient.query('set local role app_postgraphile');

    switch (command) {
      case 'loginWithGoogle':
        const { refreshToken, accessToken } = await loginWithGoogle(pgClient);

        reply.send({
          refreshToken,
          accessToken,
        });
        break;
      default:
        throw new Error(`Command '${command}' not understood.`);
    }

    await pgClient.commit();
  });
};
