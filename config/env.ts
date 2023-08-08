import dotenv from 'dotenv';
import envalid from 'envalid';
import fs from 'node:fs';
import path from 'node:path';
import * as process from 'process';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production' && process.env.DEPLOYMENT == null) {
  throw new Error('DEPLOYMENT must be set in production');
}

const cleanedBase = envalid.cleanEnv(process.env, {
  NODE_ENV: envalid.str({ choices: ['development', 'production'], default: 'development' }),
  DEPLOYMENT: envalid.str({
    choices: ['production', 'stage', 'development'],
    default: 'development',
  }),
});

const overrideEnv = `.env.override`;
if (fs.existsSync(path.resolve(__dirname, overrideEnv))) {
  dotenv.config({ path: path.resolve(__dirname, overrideEnv) });
}

const deploymentEnv = `.env.${cleanedBase.DEPLOYMENT}`;
dotenv.config({ path: path.resolve(__dirname, deploymentEnv) });

const baseEnv = '.env.base';
dotenv.config({ path: path.resolve(__dirname, baseEnv) });

const cleaned = envalid.cleanEnv(process.env, {
  DATABASE_URL: envalid.str(),
  ROOT_DATABASE_URL: envalid.str(),
  AWS_ACCESS_KEY_ID: envalid.str(),
  AWS_SECRET_ACCESS_KEY: envalid.str(),
  S3_BUCKET_NAME: envalid.str(),
  S3_BUCKET_REGION: envalid.str(),
  DEBUG: envalid.str(),
  WEB_ORIGIN: envalid.str(),
  API_ORIGIN: envalid.str(),
  ADMIN_EMAIL: envalid.str(),
  ROBOT_EMAIL: envalid.str(),
  APP_NAME: envalid.str(),
  API_PORT: envalid.port({ default: 8080 }),
  GOOGLE_REFRESH_TOKEN: envalid.str(),
});

const jwts =
  process.env.NODE_ENV === 'production'
    ? envalid.cleanEnv(process.env, {
        JWT_PUBLIC_KEY: envalid.str(),
        JWT_SECRET_KEY: envalid.str(),
      })
    : envalid.cleanEnv(process.env, {
        JWT_PUBLIC_KEY: envalid.str({
          default: fs.readFileSync('../cert-local/public.pem', 'ascii'),
        }),
        JWT_SECRET_KEY: envalid.str({
          default: fs.readFileSync('../cert-local/private.pem', 'ascii'),
        }),
      });

const ssls =
  process.env.NODE_ENV === 'production'
    ? envalid.cleanEnv(process.env, {
        SSL_CERT: envalid.str(),
        SSL_KEY: envalid.str(),
      })
    : envalid.cleanEnv(process.env, {
        SSL_CERT: envalid.str({ default: fs.readFileSync('../cert-local/localhost.crt', 'ascii') }),
        SSL_KEY: envalid.str({
          default: fs.readFileSync('../cert-local/localhost.decrypted.key', 'ascii'),
        }),
      });

const google =
  process.env.NODE_ENV === 'production'
    ? envalid.cleanEnv(process.env, {
        GOOGLE_CLIENT_ID: envalid.str(),
        GOOGLE_CLIENT_SECRET: envalid.str(),
        GOOGLE_REDIRECT_URI: envalid.str(),
      })
    : (() => {
        const clientJson = fs.readFileSync('../cert-local/client_secret.json', 'ascii');
        const client = JSON.parse(clientJson);
        return envalid.cleanEnv(process.env, {
          GOOGLE_CLIENT_ID: envalid.str({ default: client.installed.client_id }),
          GOOGLE_CLIENT_SECRET: envalid.str({ default: client.installed.client_secret }),
          GOOGLE_REDIRECT_URI: envalid.str({ default: client.installed.redirect_uris[0] }),
        });
      })();

export const env = {
  ...cleanedBase,
  ...cleaned,
  ...jwts,
  ...ssls,
  ...google,
};
