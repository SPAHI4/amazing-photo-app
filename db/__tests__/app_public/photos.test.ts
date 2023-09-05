import { PoolClient } from 'pg';
import { createUsers, withRootDb } from '../helpers.js';

const insertPhoto = async (client: PoolClient, userId: number) => {
  const {
    rows: [row],
  } = await client.query(
    `INSERT INTO app_public.photos (url, author_id, height, width, location_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    ['https://example.com', userId, 100, 100, 1],
  );
  return row;
};

const deletePhoto = async (client: PoolClient, imageId: number) => {
  await client.query(`DELETE FROM app_public.photos WHERE id = $1`, [imageId]);
};

it('triggers worker after deleting photo', async () => {
  await withRootDb(async (client) => {
    const [user] = await createUsers(client, 1, 'app_user');
    const photo = await insertPhoto(client, user.id);

    await deletePhoto(client, photo.id);

    const {
      rows: [row],
    } = await client.query(
      `SELECT * FROM graphile_worker.jobs WHERE task_identifier = 'delete_image'`,
    );
    expect(row).toBeTruthy();
  });
});
