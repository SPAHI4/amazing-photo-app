import * as fs from 'node:fs/promises';
import path from 'path';

const dirname = new URL('.', import.meta.url).pathname;

await fs.rm('.persisted-documents', { recursive: true, force: true });
await fs.mkdir('.persisted-documents');

const clientFile = await fs.readFile(
  path.resolve(dirname, '../../client/src/__generated__/persisted-documents.json'),
  'utf8',
);
const clientJson = JSON.parse(clientFile);

const clientOnlyDirectives = ['@nonreactive', '@client'];
const regexForStrip = new RegExp(clientOnlyDirectives.join('|'), 'gi');

await Promise.all(
  Object.entries(clientJson).map(
    async ([key, value]) =>
      fs.writeFile(
        `.persisted-documents/${key}.graphql`,
        (value as string).replace(regexForStrip, ''),
      ),
    { encoding: 'utf8' },
  ),
);

console.log('Persisted documents written to .persisted-documents/');
