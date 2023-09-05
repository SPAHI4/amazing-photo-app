import type { PoolClient } from 'pg';
import { becomeUser, createUsers, snapshotSafe, withRootDb } from '../helpers.js';

async function insertPhoto(client: PoolClient, userId: number) {
  const {
    rows: [row],
  } = await client.query(
    `INSERT INTO app_public.photos (url, author_id, height, width, location_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    ['https://example.com', userId, 100, 100, 1],
  );
  return row;
}

async function selectPhoto(client: PoolClient, photoId: number) {
  const {
    rows: [row],
  } = await client.query(`SELECT * FROM app_public.photos WHERE id = $1`, [photoId]);
  return row;
}

async function upsertPhotoLike(client: PoolClient, photoId: number, count: number) {
  const {
    rows: [row],
  } = await client.query('SELECT * FROM app_public.upsert_photo_like($1, $2)', [photoId, count]);
  return row;
}

describe('Upsert Photo Like', () => {
  it('upserts photo like correctly', async () => {
    await withRootDb(async (client) => {
      const [user] = await createUsers(client, 1, 'app_user');
      await becomeUser(client, user.id);
      const photo = await insertPhoto(client, user.id);
      const photoLike = await upsertPhotoLike(client, photo.id, 1);
      expect(photoLike).toBeTruthy();
      expect(photoLike.count).toEqual(1);
      expect(snapshotSafe(photoLike)).toMatchSnapshot();
    });
  });

  it('updates photo like correctly', async () => {
    await withRootDb(async (client) => {
      const [user1, user2] = await createUsers(client, 2, 'app_user');
      await becomeUser(client, user1.id);
      let photo = await insertPhoto(client, user1.id);
      await upsertPhotoLike(client, photo.id, 1);
      const photoLike = await upsertPhotoLike(client, photo.id, 3);
      expect(photoLike).toBeTruthy();
      expect(photoLike.count).toEqual(3);

      await becomeUser(client, user2.id);
      const photoLike2 = await upsertPhotoLike(client, photo.id, 2);
      expect(photoLike2).toBeTruthy();
      expect(photoLike2.count).toEqual(2);
      photo = await selectPhoto(client, photo.id);
      expect(photo.likes_count).toEqual(5);
    });
  });
});
