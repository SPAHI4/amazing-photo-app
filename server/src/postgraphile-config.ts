import { PostGraphileOptions, makePluginHook } from 'postgraphile';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import PersistedOperationsPlugin from '@graphile/persisted-operations';
import { GraphQLError } from 'graphql';
import PgOmitArchivedImp from '@graphile-contrib/pg-omit-archived';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IncomingMessage } from 'node:http';
import { env } from '@app/config/env.ts';
import { locationBySlugQuery } from './queries.ts';
import { BinaryTypePlugin } from './graphql-types.ts';
import { loginWithGoogleMutation, TOKEN_ERRORS } from './oauth.ts';
import { createImageUploadMutation } from './mutations.ts';
import { getGraphqlContext } from './graphql-context.ts';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const PgOmitArchivedPlugin = PgOmitArchivedImp.default ?? PgOmitArchivedImp;

const mutationsPlugins = [createImageUploadMutation, loginWithGoogleMutation];
const queriesPlugins = [locationBySlugQuery];

const pluginHook = makePluginHook([PersistedOperationsPlugin]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errorsHandler = (errors: ReadonlyArray<GraphQLError>) => {
  const newErrors = [];

  for (const err of errors) {
    switch (err.name) {
      case 'TokenExpiredError':
        newErrors.push(
          new GraphQLError(err.message, err.nodes, err.source, err.positions, err.path, err, {
            code: TOKEN_ERRORS.TOKEN_EXPIRED,
          }),
        );
        break;
      case 'JsonWebTokenError':
        newErrors.push(
          new GraphQLError(err.message, err.nodes, err.source, err.positions, err.path, err, {
            code: TOKEN_ERRORS.TOKEN_INVALID,
          }),
        );
        break;
      case 'NotBeforeError':
        newErrors.push(
          new GraphQLError(err.message, err.nodes, err.source, err.positions, err.path, err, {
            code: TOKEN_ERRORS.TOKEN_NOT_ACTIVE,
          }),
        );
        break;

      default:
        newErrors.push(err);
    }
  }

  return newErrors;
};

export const postgraphileConfiig: PostGraphileOptions = {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  pgDefaultRole: 'app_anonymous',
  ownerConnectionString: env.ROOT_DATABASE_URL,

  jwtPublicKey: env.JWT_PUBLIC_KEY,
  jwtSecret: env.JWT_SECRET_KEY,
  jwtPgTypeIdentifier: 'app_public.jwt_token',
  jwtSignOptions: {
    algorithm: 'RS256' as const,
  },
  jwtVerifyOptions: {
    algorithms: ['RS256' as const],
  },

  disableQueryLog: false,
  allowExplain: true,
  subscriptions: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  exportGqlSchemaPath: './schema.graphql',
  additionalGraphQLContextFromRequest: (req, res) => getGraphqlContext(req, res),
  handleErrors: errorsHandler,
  graphileBuildOptions: {
    pgArchivedTables: [
      'app_public.comments',
      'app_public.photos',
      'app_public.users',
      'app_public.locations',
    ],
  },
  pluginHook,

  persistedOperationsDirectory: `${__dirname}/../.persisted-documents/`,
  allowUnpersistedOperation(req: IncomingMessage) {
    return env.NODE_ENV === 'development' && req.headers.referer?.endsWith('/graphiql') === true;
  },

  appendPlugins: [
    PgSimplifyInflectorPlugin.default, // @see https://github.com/microsoft/TypeScript/issues/50690
    BinaryTypePlugin,
    PgOmitArchivedPlugin,
    ...mutationsPlugins,
    ...queriesPlugins,
  ],
};
