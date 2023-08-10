// eslint-disable-next-line import/no-extraneous-dependencies
import { ESLint } from 'eslint';

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(files.map((file) => eslint.isPathIgnored(file)));
  const filteredFiles = files.filter((_, i) => isIgnored[i] !== true);
  return filteredFiles.join(' ');
};

const fixableConfig = {
  '*.{tsx,ts,mts}': async (files) => {
    const filteredFiles = await removeIgnoredFiles(files);
    return [
      'tsc --noEmit',
      'tsc --project ./client/tsconfig.json --noEmit',
      `eslint --fix ${filteredFiles}`,
    ];
  },
  '*.{mjs,cjs,js,jsx}': async (files) => {
    const filteredFiles = await removeIgnoredFiles(files);
    return [`eslint --fix ${filteredFiles}`];
  },
  '*.json': ['prettier --write'],
};

const ciConfig = {
  '*.{tsx,ts,mts}': async (files) => {
    const filteredFiles = await removeIgnoredFiles(files);
    return [
      'tsc --noEmit',
      'tsc --project ./client/tsconfig.json --noEmit',
      `eslint ${filteredFiles}`,
    ];
  },
  '*.{mjs,cjs,js,jsx}': async (files) => {
    const filteredFiles = await removeIgnoredFiles(files);
    return [`eslint ${filteredFiles}`];
  },
  '*.json': ['prettier --check'],
};

const isCi = process.env.GITHUB_ACTIONS === 'true';

export default isCi ? ciConfig : fixableConfig;
