import { env } from '@app/config/env.js';
import { buildApp } from './app.js';

const app = await buildApp({});

try {
  await app.listen({
    port: env.API_PORT,
    host: env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
