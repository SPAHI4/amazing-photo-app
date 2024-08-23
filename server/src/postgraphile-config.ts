/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unnecessary-condition */
import { PostGraphileOptions, makePluginHook } from 'postgraphile';
import PgSimplifyInflectorPluginImp from '@graphile-contrib/pg-simplify-inflector';
import PersistedOperationsPlugin from '@graphile/persisted-operations';
import { GraphQLError } from 'graphql';
import PgOmitArchivedImp from '@graphile-contrib/pg-omit-archived';
import { IncomingMessage } from 'node:http';
import { env } from '@app/config/env.js';
import { locationBySlugQuery } from './queries.js';
import { BinaryTypePlugin } from './graphql-types.js';
import { loginWithGoogleMutation, TokenErrors } from './oauth.js';
import { createImageUploadMutation } from './mutations.js';
import { GraphqlContextFactory } from './context/GraphqlContextFactory.js';

const PgOmitArchivedPlugin = PgOmitArchivedImp.default ?? PgOmitArchivedImp;
const PgSimplifyInflectorPlugin =
  PgSimplifyInflectorPluginImp.default ?? PgSimplifyInflectorPluginImp;

const mutationsPlugins = [createImageUploadMutation, loginWithGoogleMutation];
const queriesPlugins = [locationBySlugQuery];

let pluginHook = makePluginHook([PersistedOperationsPlugin]);

const IS_JEST = process.env.JEST_WORKER_ID !== undefined;
if (IS_JEST) {
  // we don't need persisted operations in tests
  pluginHook = makePluginHook([]);
}

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

const devBaseConfig: Partial<PostGraphileOptions> = {
  graphiql: true,
  enhanceGraphiql: true,
  disableQueryLog: false,
  allowExplain: true,
  subscriptions: true,
  exportGqlSchemaPath: './schema.graphql',
  pluginHook,
  allowUnpersistedOperation(req: IncomingMessage) {
    return req.headers.referer?.endsWith('/graphiql') === true;
  },
};

const prodBaseConfig: Partial<PostGraphileOptions> = {
  pluginHook,
  disableQueryLog: true,
};

const baseConfig = env.NODE_ENV === 'production' ? prodBaseConfig : devBaseConfig;

export const postgraphileConfiig: PostGraphileOptions = {
  ...baseConfig,
  watchPg: true,
  dynamicJson: true,
  retryOnInitFail: env.NODE_ENV !== 'test',
  pgDefaultRole: 'app_anonymous',
  ownerConnectionString: env.ROOT_DATABASE_URL,
  jwtPublicKey: env.JWT_PUBLIC_KEY,
  jwtSecret: env.JWT_SECRET_KEY,
  jwtPgTypeIdentifier: 'app_public.jwt_token',
  legacyRelations: 'omit',
  jwtSignOptions: {
    algorithm: 'RS256' as const,
  },
  jwtVerifyOptions: {
    algorithms: ['RS256' as const],
  },
  disableQueryLog: env.NODE_ENV === 'test',
  subscriptions: false,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  additionalGraphQLContextFromRequest: (req, res) => GraphqlContextFactory.create(req, res),
  handleErrors: errorsHandler,
  graphileBuildOptions: {
    pgArchivedTables: [
      'app_public.comments',
      'app_public.photos',
      'app_public.users',
      'app_public.locations',
    ],
  },
  persistedOperationsDirectory: `./.persisted-documents/`,
  appendPlugins: [
    // @ts-ignore ts error in jest env
    PgSimplifyInflectorPlugin,
    BinaryTypePlugin,
    // @ts-ignore ts error in jest env
    PgOmitArchivedPlugin,
    ...mutationsPlugins,
    ...queriesPlugins,
  ],
};
