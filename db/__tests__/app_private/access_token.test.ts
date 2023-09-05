import { PoolClient } from 'pg';
import { createUsers, withRootDb } from '../helpers.js';

async function getAccessToken(client: PoolClient) {
  const {
    rows: [row],
  } = await client.query('SELECT * FROM app_private.access_token()');

  return row;
}

describe('Access Token', () => {
  it('provides access token correctly', async () => {
    await withRootDb(async (client) => {
      const [user] = await createUsers(client, 1, 'app_user');
      await client.query(`set local jwt.claims.user_id to ${user.id}`);
      const accessToken = await getAccessToken(client);
      expect(accessToken).toBeTruthy();
      expect(accessToken.user_id).toEqual(user.id);
      expect(accessToken.role).toEqual('app_user');
    });
  });
});
