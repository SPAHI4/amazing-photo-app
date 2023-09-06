import { postgraphile, PostGraphileResponseFastify3, PostGraphileResponse } from 'postgraphile';
import type {
  FastifyRequest,
  FastifyReply,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify';
import { env } from '@app/config/env.js';
import { Pool } from 'pg';
import { postgraphileConfiig } from './postgraphile-config.js';

interface PostgraphileServerPluginOptions extends FastifyPluginOptions {
  pgPool?: Pool | null;
}

export const postgraphileServerPlugin: FastifyPluginAsync<PostgraphileServerPluginOptions> = async (
  app,
  options,
) => {
  const poolOrConfig = options.pgPool ?? env.DATABASE_URL;
  const postgraphileMiddleware = postgraphile(poolOrConfig, 'app_public', postgraphileConfiig);

  const convertHandler =
    (handler: ((res: PostGraphileResponse) => Promise<void>) | null) =>
    (req: FastifyRequest, res: FastifyReply) => {
      if (!handler) {
        return null;
      }

      return handler(new PostGraphileResponseFastify3(req, res));
    };

  app.options(
    postgraphileMiddleware.graphqlRoute,
    convertHandler(postgraphileMiddleware.graphqlRouteHandler),
  );

  app.post(
    postgraphileMiddleware.graphqlRoute,
    convertHandler(postgraphileMiddleware.graphqlRouteHandler),
  );

  if (postgraphileMiddleware.options.graphiql != null) {
    if (postgraphileMiddleware.graphiqlRouteHandler) {
      app.head(
        postgraphileMiddleware.graphiqlRoute,
        convertHandler(postgraphileMiddleware.graphiqlRouteHandler),
      );
      app.get(
        postgraphileMiddleware.graphiqlRoute,
        convertHandler(postgraphileMiddleware.graphiqlRouteHandler),
      );
    }

    if (postgraphileMiddleware.options.watchPg != null) {
      if (postgraphileMiddleware.eventStreamRouteHandler) {
        app.options(
          postgraphileMiddleware.eventStreamRoute,
          convertHandler(postgraphileMiddleware.eventStreamRouteHandler),
        );
        app.get(
          postgraphileMiddleware.eventStreamRoute,
          convertHandler(postgraphileMiddleware.eventStreamRouteHandler),
        );
      }
    }

    if (postgraphileMiddleware.faviconRouteHandler) {
      app.get('/favicon.ico', convertHandler(postgraphileMiddleware.faviconRouteHandler));
    }
  }
};
