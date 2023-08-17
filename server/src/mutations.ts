import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import crypto from 'crypto';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { env } from '@app/config/env.js';
import { s3 } from './s3.js';

const CONTENT_TYPES = { 'image/jpeg': 'jpeg', 'image/avif': 'avif' } as const;
const MAX_UPLOAD_SIZE = 1024 * 1024 * 20; // 20 MB

export const createImageUploadMutation = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input CreateImageUploadInput {
      contentType: String!
    }

    type CreateImageUploadPayload {
      url: String!
      fields: JSON!
      image: Image!
    }

    extend type Mutation {
      createImageUpload(input: CreateImageUploadInput!): CreateImageUploadPayload!
    }
  `,
  resolvers: {
    Mutation: {
      createImageUpload: async (_query, args, context) => {
        const { pgClient } = context;
        const { contentType } = args.input;
        if (!Object.keys(CONTENT_TYPES).includes(contentType)) {
          throw new Error(`Content type "${contentType}" is not allowed`);
        }
        const key = `${crypto.randomUUID()}.${
          CONTENT_TYPES[contentType as keyof typeof CONTENT_TYPES]
        }`;

        await pgClient.query('set role to app_postgraphile');
        const {
          rows: [image],
        } = await pgClient.query(
          `
        insert into app_public.images (s3_key, s3_bucket)
        values ($1, $2)
        returning *
    `,
          [key, env.S3_BUCKET_NAME],
        );
        await pgClient.query('set role to app_user');

        const { url, fields } = await createPresignedPost(s3, {
          Bucket: env.S3_BUCKET_NAME,
          Key: key,
          Expires: 60,
          Fields: {
            'Content-Type': contentType,
          },
          Conditions: [
            ['content-length-range', 1, MAX_UPLOAD_SIZE],
            ['eq', '$Content-Type', contentType],
          ],
        });

        return {
          url,
          fields,
          image,
        };
      },
    },
  },
}));
