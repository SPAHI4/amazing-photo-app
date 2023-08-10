/* eslint-disable no-underscore-dangle */
import { writeFileSync } from 'node:fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { createPostGraphileSchema } from 'postgraphile';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { env } from '@app/config/env.js';
import { postgraphileConfiig } from '../src/postgraphile-config.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const schema = await createPostGraphileSchema(env.DATABASE_URL, 'app_public', postgraphileConfiig);
const sorted = lexicographicSortSchema(schema);
writeFileSync(`${dirname}/../schema.graphql`, printSchema(sorted));
console.log('GraphQL schema exported');
