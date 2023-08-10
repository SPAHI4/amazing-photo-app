import { postgraphile, PostGraphileResponseFastify3, PostGraphileResponse } from 'postgraphile';
import type { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import { env } from '@app/config/env.js';
import { postgraphileConfiig } from './postgraphile-config.js';

export const postgraphileServer: FastifyPluginAsync = async (app: FastifyInstance) => {
  const postgraphileMiddleware = postgraphile(env.DATABASE_URL, 'app_public', postgraphileConfiig);

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
