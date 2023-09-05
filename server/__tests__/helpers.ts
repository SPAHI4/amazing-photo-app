import { env } from '@app/config/env.js';
import { beforeAll, jest } from '@jest/globals';
import { ExecutionResult } from 'graphql';
import type { PoolClient } from 'pg';
import pg from 'pg';
import type { Response as LightMyRequestResponse } from 'light-my-request';

if (env.SHADOW_DATABASE_URL == null) {
  throw new Error('Cannot run tests without a SHADOW_DATABASE_URL');
}

const { SHADOW_DATABASE_URL } = env;
const DATABASE_URL = SHADOW_DATABASE_URL;

let pgPool: pg.Pool;

beforeAll(async () => {
  pgPool = new pg.Pool({
    connectionString: DATABASE_URL,
  });
});

export const getPgPool = () => pgPool;

afterAll(async () => {
  const pgClient = await pgPool.connect();

  await pgClient.query(`
    delete from app_public.users
    where true
  `);

  await pgClient.query(`
    delete from app_public.images
    where true
  `);

  pgClient.release();

  await pgPool.end();
});

const { buildApp } = await import('../src/app.js');

export const runGraphQLQuery = async (
  query: string,
  payload: {
    variables?: Record<string, any>;
    headers?: Record<string, any>;
    cookies?: Record<string, any>;
  },
  checker?: (
    data: ExecutionResult,
    context: {
      pgClient: PoolClient;
      response: LightMyRequestResponse & { json: () => ExecutionResult };
    },
  ) => Promise<void> | void,
): Promise<LightMyRequestResponse & { json: () => ExecutionResult }> => {
  const pgClient = await pgPool.connect();
  const releaseImpl = pgClient.release.bind(pgClient);

  jest.spyOn(pgPool, 'connect').mockImplementation(() => Promise.resolve(pgClient));
  jest.spyOn(pgClient, 'release').mockImplementation(() => Promise.resolve());

  const app = buildApp({
    pgPool,
  });
  let response;

  try {
    await pgClient.query('BEGIN ISOLATION LEVEL SERIALIZABLE;');
    await pgClient.query('set local role app_postgraphile');

    response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query,
        variables: payload.variables,
      },
      cookies: payload.cookies,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(payload.headers || {}),
      },
    });

    await checker?.(response.json(), { pgClient, response });
  } finally {
    await pgClient.query('ROLLBACK;');
    await pgClient.query('RESET ALL;');
    releaseImpl();
  }

  return response;
};

let known: Record<string, { counter: number; values: Map<unknown, string> }> = {};
beforeEach(() => {
  known = {};
});

export function sanitize(json: any): any {
  /* This allows us to maintain stable references whilst dealing with variable values */
  function mask(value: unknown, type: string) {
    if (!known[type]) {
      known[type] = { counter: 0, values: new Map() };
    }
    const o = known[type];
    if (!o.values.has(value)) {
      // eslint-disable-next-line no-plusplus
      o.values.set(value, `[${type}-${++o.counter}]`);
    }
    return o.values.get(value);
  }

  if (Array.isArray(json)) {
    return json.map((val) => sanitize(val));
  }
  if (json && typeof json === 'object') {
    const result = { ...json };
    for (const k in result) {
      if (k === 'nodeId' && typeof result[k] === 'string') {
        result[k] = mask(result[k], 'nodeId');
      } else if (
        k === 'id' ||
        k === 'uuid' ||
        (k.endsWith('Id') && (typeof json[k] === 'number' || typeof json[k] === 'string')) ||
        (k.endsWith('Uuid') && typeof k === 'string')
      ) {
        result[k] = mask(result[k], 'id');
      } else if ((k.endsWith('At') || k === 'datetime') && typeof json[k] === 'string') {
        result[k] = mask(result[k], 'timestamp');
      } else if (k.match(/^deleted[A-Za-z0-9]+Id$/) && typeof json[k] === 'string') {
        result[k] = mask(result[k], 'nodeId');
      } else if (k === 'email' && typeof json[k] === 'string') {
        result[k] = mask(result[k], 'email');
      } else if (k === 'username' && typeof json[k] === 'string') {
        result[k] = mask(result[k], 'username');
      } else {
        result[k] = sanitize(json[k]);
      }
    }
    return result;
  }
  return json;
}
