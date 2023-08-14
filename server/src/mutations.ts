import { gql, makeExtendSchemaPlugin } from 'graphile-utils';
import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@app/config/env.js';
import { s3 } from './s3.js';

const CONTENT_TYPES = { 'image/jpeg': 'jpeg', 'image/avif': 'avif' } as const;

export const createImageUploadMutation = makeExtendSchemaPlugin(() => ({
  typeDefs: gql`
    input CreateImageUploadInput {
      contentType: String!
    }

    type CreateImageUploadPayload {
      signedUrl: String!
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

        const command = new PutObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: key,
          ContentType: contentType,
          ACL: 'public-read',
        });

        const presignedPutUrl = await getSignedUrl(s3, command, {
          expiresIn: 60,
        });

        return {
          signedUrl: presignedPutUrl,
          image,
        };
      },
    },
  },
}));
