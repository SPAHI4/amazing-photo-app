import { expect, jest } from '@jest/globals';

jest.unstable_mockModule('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    getToken: jest.fn().mockReturnValue({
      tokens: {
        refresh_token: 'mock_refresh_token',
      },
    }),
    setCredentials: jest.fn(),
    request: jest.fn().mockReturnValue({
      data: {
        id: 'mock_user_id',
        email: 'test@gmail.com',
        picture: 'https://mock_image_url',
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        locale: 'en',
        verified_email: true,
      },
    }),
  })),
}));

const { runGraphQLQuery } = await import('../helpers.js');

const LOGIN_WITH_GOOGLE = /* GraphQL */ `
  mutation LoginWithGoogle {
    loginWithGoogle(input: { code: "mock_code", toCookie: false }) {
      accessToken
      refreshToken
      user {
        id
      }
    }
  }
`;

describe('loginWithGoogle', () => {
  it('should return access and create user', async () => {
    await runGraphQLQuery(LOGIN_WITH_GOOGLE, {}, async (json, { pgClient }) => {
      expect(json.errors).toBeFalsy();
      expect(json.data.loginWithGoogle.accessToken).toBeTruthy();
      expect(json.data.loginWithGoogle.refreshToken).toBeTruthy();

      await pgClient.query('set local role app_postgraphile');

      const {
        rows: [user],
      } = await pgClient.query(`
          select
              *
          from
              app_private.user_data
          join
              app_public.users on app_public.users.id = app_private.user_data.user_id
          where
              google_id = 'mock_user_id'
          `);

      expect(user.id).toBeTruthy();

      expect(user.google_id).toBe('mock_user_id');
      expect(user.display_name).toBe('Test User');
    });
  });

  it('it should update existing user', async () => {
    let userId;

    await runGraphQLQuery(LOGIN_WITH_GOOGLE, {}, async (json) => {
      expect(json.data.loginWithGoogle.user.id).toBeTruthy();
      userId = json.data.loginWithGoogle.user.id;
    });

    await runGraphQLQuery(LOGIN_WITH_GOOGLE, {}, async (json) => {
      expect(json.data.loginWithGoogle.user.id).toBe(userId);
    });
  });

  it('should revoke token on logout', async () => {
    const userResponse = await runGraphQLQuery(LOGIN_WITH_GOOGLE, {});

    const logoutResponse = await runGraphQLQuery(
      /* GraphQL */ `
        mutation Logout {
          logout(input: { fromCookie: true })
        }
      `,
      {
        cookies: {
          refreshToken: userResponse.json().data.loginWithGoogle.refreshToken,
        },
      },
      async (_json, { pgClient }) => {
        const {
          rows: [session],
        } = await pgClient.query(
          `
              select
                  *
              from
                  app_private.sessions
              where
                  user_id = $1
              order by created_at desc
             `,
          [userResponse.json().data.loginWithGoogle.user.id],
        );

        expect(session.token_revoked_at).toBeTruthy();
      },
    );

    const [foundCookie] = logoutResponse.cookies;

    expect(foundCookie).toMatchObject({
      name: 'refreshToken',
      value: '',
      maxAge: 0,
      path: '/graphql',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });
  });
});

describe('getAccessToken', () => {
  const GET_ACCESS_TOKEN = /* GraphQL */ `
    mutation GetAccessToken {
      getAccessToken(input: { fromCookie: true }) {
        accessToken
      }
    }
  `;

  it('should return access token', async () => {
    const userResponse = await runGraphQLQuery(LOGIN_WITH_GOOGLE, {});

    await runGraphQLQuery(
      GET_ACCESS_TOKEN,
      {
        cookies: {
          refreshToken: userResponse.json().data.loginWithGoogle.refreshToken,
        },
      },
      async (json) => {
        expect(json.errors).toBeFalsy();
        expect(json.data.getAccessToken.accessToken).toBeTruthy();
      },
    );
  });

  it('should validate token itself', async () => {
    await runGraphQLQuery(
      GET_ACCESS_TOKEN,
      {
        cookies: {
          refreshToken: 'invalid_token',
        },
      },
      async (json) => {
        expect(json.errors).toBeTruthy();
        expect(json.errors[0].extensions.code).toBe('TOKEN_INVALID');
      },
    );
  });

  it('should return proper error code', async () => {
    await runGraphQLQuery(GET_ACCESS_TOKEN, {}, async (json) => {
      expect(json.errors).toBeTruthy();
      expect(json.errors[0].extensions.code).toBe('REFRESH_TOKEN_EMPTY');
    });
  });
});

const CURRENT_USER = /* GraphQL */ `
  query {
    currentUser {
      id
      displayName
      pictureUrl
      role
    }
  }
`;

describe('currentUser', () => {
  it('should return null for anonymous', async () => {
    await runGraphQLQuery(CURRENT_USER, {}, (json) => {
      expect(json.errors).toBeFalsy();
      expect(json.data).toBeTruthy();
      expect(json.data!.currentUser).toBe(null);
    });
  });

  it('should return user', async () => {
    const userResponse = await runGraphQLQuery(LOGIN_WITH_GOOGLE, {});

    await runGraphQLQuery(
      CURRENT_USER,
      {
        headers: {
          Authorization: `Bearer ${userResponse.json().data.loginWithGoogle.accessToken}`,
        },
      },
      (json) => {
        expect(json.errors).toBeFalsy();
        expect(json.data).toBeTruthy();
        expect(json.data!.currentUser).toMatchObject({
          id: userResponse.json().data.loginWithGoogle.user.id,
          displayName: 'Test User',
          pictureUrl: 'https://mock_image_url',
          role: 'APP_USER',
        });
      },
    );
  });
});
