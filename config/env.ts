import dotenv from 'dotenv';
import envalid from 'envalid';
import fs from 'node:fs';
import path from 'node:path';

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

let jwts;
let ssls;
let google;

// load certs, keys, and google configs based on environment for production
// or from local files for development (these files are not checked into git)
if (cleanedBase.NODE_ENV === 'production') {
  jwts = envalid.cleanEnv(process.env, {
    JWT_PUBLIC_KEY: envalid.str(),
    JWT_SECRET_KEY: envalid.str(),
  });

  ssls = envalid.cleanEnv(process.env, {
    SSL_CERT: envalid.str(),
    SSL_KEY: envalid.str(),
  });

  google = envalid.cleanEnv(process.env, {
    INSTALLED_GOOGLE_CLIENT_ID: envalid.str(),
    INSTALLED_GOOGLE_CLIENT_SECRET: envalid.str(),
    INSTALLED_GOOGLE_REDIRECT_URI: envalid.str(),

    WEB_GOOGLE_CLIENT_ID: envalid.str(),
    WEB_GOOGLE_CLIENT_SECRET: envalid.str(),
    WEB_GOOGLE_REDIRECT_URI: envalid.str(),
  });
} else {
  jwts = envalid.cleanEnv(process.env, {
    JWT_PUBLIC_KEY: envalid.str({
      default: fs.readFileSync(path.resolve(__dirname, '../cert-local/public.pem'), 'ascii'),
    }),
    JWT_SECRET_KEY: envalid.str({
      default: fs.readFileSync(path.resolve(__dirname, '../cert-local/private.pem'), 'ascii'),
    }),
  });

  ssls = envalid.cleanEnv(process.env, {
    SSL_CERT: envalid.str({
      default: fs.readFileSync(path.resolve(__dirname, '../cert-local/localhost.crt'), 'ascii'),
    }),
    SSL_KEY: envalid.str({
      default: fs.readFileSync(
        path.resolve(__dirname, '../cert-local/localhost.decrypted.key'),
        'ascii',
      ),
    }),
  });

  const loadJson = (filepath: string) => JSON.parse(fs.readFileSync(filepath, 'ascii'));
  const webGoogleConfig = loadJson(path.resolve(__dirname, '../cert-local/web.client_secret.json'));
  const installedGoogleConfig = loadJson(
    path.resolve(__dirname, '../cert-local/installed.client_secret.json'),
  );

  google = envalid.cleanEnv(process.env, {
    INSTALLED_GOOGLE_CLIENT_ID: envalid.str({ default: installedGoogleConfig.installed.client_id }),
    INSTALLED_GOOGLE_CLIENT_SECRET: envalid.str({
      default: installedGoogleConfig.installed.client_secret,
    }),
    INSTALLED_GOOGLE_REDIRECT_URI: envalid.str({
      default: installedGoogleConfig.installed.redirect_uris[0],
    }),

    WEB_GOOGLE_CLIENT_ID: envalid.str({ default: webGoogleConfig.web.client_id }),
    WEB_GOOGLE_CLIENT_SECRET: envalid.str({ default: webGoogleConfig.web.client_secret }),
    WEB_GOOGLE_REDIRECT_URI: envalid.str({ default: webGoogleConfig.web.redirect_uris[0] }),
  });
}

export const env = {
  ...cleanedBase,
  ...cleaned,
  ...jwts,
  ...ssls,
  ...google,
};
