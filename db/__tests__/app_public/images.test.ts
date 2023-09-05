import { PoolClient } from 'pg';
import { createUsers, withRootDb } from '../helpers.js';

const createImage = async (client: PoolClient, userId: number) => {
  const {
    rows: [image],
  } = await client.query(
    `INSERT INTO app_public.images (s3_key, s3_bucket, user_id) VALUES ($1, $2, $3) RETURNING *`,
    ['s3_key', 's3_bucket', userId],
  );

  return image;
};

describe('app_public.images', () => {
  it('triggers worker after uploading', async () => {
    await withRootDb(async (client) => {
      const [user] = await createUsers(client, 1, 'app_user');
      const image = await createImage(client, user.id);

      // update is_uploaded to true
      await client.query(`UPDATE app_public.images SET is_uploaded = true WHERE id = $1`, [
        image.id,
      ]);

      const {
        rows: [row],
      } = await client.query(
        `SELECT * FROM graphile_worker.jobs WHERE task_identifier = 'convert_image'`,
      );
      expect(row).toBeTruthy();
      expect(row.payload.image_id).toBe(image.id);
    });
  });
});
