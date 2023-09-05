import { PoolClient } from 'pg';
import { snapshotSafe, withRootDb } from '../helpers.js';

// This simulates the data your Google API might send
const mockGoogleUser = {
  google_id: 'testGoogleId',
  google_email: 'testEmail@gmail.com',
  google_refresh_token: 'testRefreshToken',
  google_picture_url: 'https://testPictureUrl',
  google_name: 'Test Google User',
  google_given_name: 'Test',
  google_family_name: 'User',
  google_locale: 'en-US',
  google_verified_email: true,
};

async function upsertUser(client: PoolClient, googleUser: any) {
  const {
    rows: [row],
  } = await client.query(
    'SELECT * FROM app_private.upsert_user($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    Object.values(googleUser),
  );

  return row;
}

describe('Upsert User', () => {
  it('upserts a new user correctly', () =>
    withRootDb(async (client) => {
      const user = await upsertUser(client, mockGoogleUser);
      expect(user).toBeTruthy();
      expect(user.id).toBeTruthy();
      expect(snapshotSafe(user)).toMatchSnapshot();
    }));

  it('updates an existing user correctly', () =>
    withRootDb(async (client) => {
      await upsertUser(client, mockGoogleUser);
      const updatedUser = { ...mockGoogleUser, google_name: 'Updated name' };
      const user = await upsertUser(client, updatedUser);
      expect(user).toBeTruthy();
      expect(user.display_name).toEqual(updatedUser.google_name);
      expect(snapshotSafe(user)).toMatchSnapshot();
    }));
});
