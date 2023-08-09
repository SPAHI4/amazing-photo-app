import { env } from '@app/config/env.ts';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import type {} from '../types/node.d.ts';
import type {} from '../types/global.d.ts';
import { postgraphileServer } from './postgraphile-server.ts';
import { appSitemap } from './sitemap.ts';

const app = fastify({
  https: {
    key: env.SSL_KEY,
    cert: env.SSL_CERT,
  },
  logger: true,
});

app.register(fastifyRateLimit, {
  max: 3000,
  timeWindow: '1 minute'   
});

// CORS
app.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (origin == null) {
      cb(null, true);
      return;
    }

    const { hostname } = new URL(origin);
    if (hostname === 'localhost') {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
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
// import('../scripts/export-schema.ts').then(({ main }) => main());
