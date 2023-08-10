import { auth } from '@googleapis/gmail';
import * as readline from 'node:readline';
import { env } from '@app/config/env.js';

const oAuth2Client = new auth.OAuth2(
  env.INSTALLED_GOOGLE_CLIENT_ID,
  env.INSTALLED_GOOGLE_CLIENT_SECRET,
  env.INSTALLED_GOOGLE_REDIRECT_URI,
);

const scopes = ['https://www.googleapis.com/auth/gmail.send', 'https://mail.google.com'];

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting this url:', url);

const userCode = await new Promise<string>((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    resolve(code);
  });
});

const res = await oAuth2Client.getToken(userCode);
oAuth2Client.setCredentials(res.tokens);
console.log('Successfully retrieved new token:', res.tokens);
