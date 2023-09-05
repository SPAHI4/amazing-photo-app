import { env } from '@app/config/env.js';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: env.S3_BUCKET_REGION,
  credentials:
    env.NODE_ENV === 'production'
      ? undefined
      : {
          accessKeyId: env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        },
});
