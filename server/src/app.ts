import { env } from '@app/config/env.js';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import type {} from '../types/node.d.js';
import type {} from '../types/global.d.js';
import { Pool } from 'pg';
import { postgraphileServerPlugin } from './postgraphile-server-plugin.js';
import { appSitemap } from './sitemap.js';

interface BuildAppOptions {
  pgPool?: Pool | null;
}

export const buildApp = async (options: BuildAppOptions) => {
  const app = fastify({
    https:
      env.NODE_ENV !== 'test'
        ? {
            key: env.SSL_KEY,
            cert: env.SSL_CERT,
          }
        : null,
    logger: env.NODE_ENV !== 'never',
  });

  app.register(fastifyRateLimit, {
    max: 3000,
    timeWindow: '1 minute',
  });

  app.register(fastifyCors, {
    credentials: true,
    origin: (origin, cb) => {
      if (origin == null) {
        cb(null, true);
        return;
      }

      const { hostname } = new URL(origin);
      if (hostname === 'localhost') {
        cb(null, true);
        return;
      }

      if (origin === env.WEB_ORIGIN) {
        cb(null, true);
        return;
      }

      cb(new Error('Not allowed'), false);
    },
  });

  app.register(appSitemap);

  app.register(postgraphileServerPlugin, {
    pgPool: options.pgPool,
  });

  if (['localhost', 'ci'].includes(env.DEPLOYMENT)) {
    const { cypressServerCommandPlugin } = await import('./cypress-server-command-plugin.js');

    app.register(cypressServerCommandPlugin);
  }

  return app;
};
