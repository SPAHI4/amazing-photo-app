/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/graphile/starter
import { Pool, PoolClient } from 'pg';

const pools: Record<string, Pool> = {};

if (process.env.TEST_DATABASE_URL == null) {
  throw new Error('Cannot run tests without a TEST_DATABASE_URL');
}

export const { TEST_DATABASE_URL } = process.env;
export const poolFromUrl = (url: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (pools[url] == null) {
    pools[url] = new Pool({ connectionString: url });
  }
  return pools[url];
};

type ClientCallback<T = never> = (client: PoolClient) => Promise<T>;

const withDbFromUrl = async <T>(url: string, fn: ClientCallback<T>) => {
  const pool = poolFromUrl(url);
  const client = await pool.connect();
  await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE;');

  try {
    await fn(client);
  } catch (e: any) {
    if (typeof e.code === 'string' && Boolean(e.code.match(/^[0-9A-Z]{5}$/))) {
      console.error([e.message, e.code, e.detail, e.hint, e.where].join('\n'));
    }
    throw e;
  } finally {
    await client.query('ROLLBACK;');
    await client.query('RESET ALL;');
    await client.release();
  }
};

export const withRootDb = <T>(fn: ClientCallback<T>) => withDbFromUrl(TEST_DATABASE_URL, fn);

afterAll(() => {
  const keys = Object.keys(pools);
  return Promise.all(
    keys.map(async (key) => {
      try {
        const pool = pools[key];
        delete pools[key];
        await pool.end();
      } catch (e: unknown) {
        console.error('Failed to release connection!');
        console.error(e);
      }
    }),
  );
});
