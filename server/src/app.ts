import { env } from '@app/config/env.js';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import type {} from '../types/node.d.js';
import type {} from '../types/global.d.js';
import { postgraphileServer } from './postgraphile-server.js';
import { appSitemap } from './sitemap.js';

const app = fastify({
  https: {
    key: env.SSL_KEY,
    cert: env.SSL_CERT,
  },
  logger: true,
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

app.register(postgraphileServer);

try {
  await app.listen({ port: env.API_PORT });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
