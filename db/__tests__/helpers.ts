/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/strict-boolean-expressions,no-nested-ternary,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/naming-convention */
// source from https://github.com/graphile/starter
import { env } from '@app/config/env.js';
import pg from 'pg';
import type { PoolClient } from 'pg';
import mapValues from 'lodash/mapValues.js';

type app_public = {
  users: {
    id: number;
    display_name: string;
    role: 'app_user' | 'app_admin';
    created_at: Date;
    updated_at: Date;
    is_archived: boolean;
  };
};

const { SHADOW_DATABASE_URL } = env;

const DATABASE_URL = SHADOW_DATABASE_URL;

const pools: Record<string, pg.Pool> = {};
export const poolFromUrl = (url: string) => {
  if (pools[url] == null) {
    pools[url] = new pg.Pool({ connectionString: url });
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
    client.release();
  }
};

export const becomeRoot = (client: PoolClient) => client.query('reset role');

export const createUsers = async (
  client: PoolClient,
  count: number,
  role: 'app_user' | 'app_admin',
) => {
  const rows = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      const displayName = `Test User ${i + 1}`;

      const {
        rows: [row],
      } = await client.query<app_public['users']>(
        `
        insert into app_public.users (display_name, role) values ($1, $2) returning *
      `,
        [displayName, role],
      );

      return row;
    }),
  );

  return rows;
};

export const becomeUser = async (client: PoolClient, userId: number) => {
  await becomeRoot(client);
  await client.query(
    `select set_config('role', $1::text, true), set_config('jwt.claims.user_id', $2, true)`,
    ['app_user', userId],
  );
};

export const withRootDb = <T>(fn: ClientCallback<T>) => withDbFromUrl(DATABASE_URL, fn);

export const withUserDb = <T>(fn: (client: PoolClient, user: app_public['users']) => Promise<T>) =>
  withRootDb(async (client) => {
    const [user] = await createUsers(client, 1, 'app_user');
    await becomeUser(client, user.id);
    await fn(client, user);
  });

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

const idReplacement = (v: string | number | null) => (!v ? v : '[ID]');
export const pruneIds = (row: { [key: string]: unknown }) =>
  mapValues(row, (v, k) =>
    (k === 'id' || k.endsWith('_id')) && (typeof v === 'string' || typeof v === 'number')
      ? idReplacement(v)
      : v,
  );

const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const pruneUUIDs = (row: { [key: string]: unknown }) =>
  mapValues(row, (v, k) => {
    if (typeof v !== 'string') {
      return v;
    }
    const val = v;
    return ['uuid', 'queue_name'].includes(k) && v.match(uuidRegexp)
      ? '[UUID]'
      : k === 'gravatar' && val.match(/^[0-9a-f]{32}$/i)
      ? '[gUUID]'
      : v;
  });

export const pruneDates = (row: { [key: string]: unknown }) =>
  mapValues(row, (v, k) => {
    if (!v) {
      return v;
    }
    if (v instanceof Date) {
      return '[DATE]';
    }
    if (typeof v === 'string' && k.match(/(_at|At)$/) && v.match(/^20[0-9]{2}-[0-9]{2}-[0-9]{2}/)) {
      return '[DATE]';
    }
    return v;
  });

export const pruneHashes = (row: { [key: string]: unknown }) =>
  mapValues(row, (v, k) =>
    Boolean(k.endsWith('_hash')) && typeof v === 'string' && v[0] === '$' ? '[hash]' : v,
  );

export const snapshotSafe = (obj: { [key: string]: unknown }) =>
  pruneHashes(pruneUUIDs(pruneIds(pruneDates(obj))));
