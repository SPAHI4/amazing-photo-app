/* eslint-disable no-underscore-dangle */
import { writeFileSync } from 'node:fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { createPostGraphileSchema } from 'postgraphile';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { env } from '@app/config/env.ts';
import { postgraphileConfiig } from '../src/postgraphile-config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = await createPostGraphileSchema(env.DATABASE_URL, 'app_public', postgraphileConfiig);
const sorted = lexicographicSortSchema(schema);
writeFileSync(`${__dirname}/../schema.graphql`, printSchema(sorted));
console.log('GraphQL schema exported');
