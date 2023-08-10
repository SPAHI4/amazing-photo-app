import { PostGraphileOptions, makePluginHook } from 'postgraphile';
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector';
import PersistedOperationsPlugin from '@graphile/persisted-operations';
import { GraphQLError } from 'graphql';
import PgOmitArchivedImp from '@graphile-contrib/pg-omit-archived';
import { IncomingMessage } from 'node:http';
import { env } from '@app/config/env.js';
import { locationBySlugQuery } from './queries.js';
import { BinaryTypePlugin } from './graphql-types.js';
import { loginWithGoogleMutation, TokenErrors } from './oauth.js';
import { createImageUploadMutation } from './mutations.js';
import { getGraphqlContext } from './graphql-context.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const PgOmitArchivedPlugin = PgOmitArchivedImp.default ?? PgOmitArchivedImp;

const mutationsPlugins = [createImageUploadMutation, loginWithGoogleMutation];
const queriesPlugins = [locationBySlugQuery];

const pluginHook = makePluginHook([PersistedOperationsPlugin]);

const errorsHandler = (errors: ReadonlyArray<GraphQLError>) => {
  const newErrors = [];

  for (const err of errors) {
    switch (err.name) {
      case 'TokenExpiredError':
        newErrors.push(
          new GraphQLError(err.message, err.nodes, err.source, err.positions, err.path, err, {
            code: TokenErrors.TOKEN_EXPIRED,
          }),
        );
        break;
      case 'JsonWebTokenError':
        newErrors.push(
          new GraphQLError(err.message, err.nodes, err.source, err.positions, err.path, err, {
            code: TokenErrors.TOKEN_INVALID,
          }),
        );
        break;
      case 'NotBeforeError':
        newErrors.push(
          new GraphQLError(err.message, err.nodes, err.source, err.positions, err.path, err, {
            code: TokenErrors.TOKEN_NOT_ACTIVE,
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

  persistedOperationsDirectory: `./.persisted-documents/`,
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
