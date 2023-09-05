import { createRequire } from 'module';

/** @type {(dir: string) => import('ts-jest').JestConfigWithTsJest} */
export default (dir) => {
  const require = createRequire(import.meta.url);
  // eslint-disable-next-line import/no-dynamic-require
  const packageObj = require(`${dir}/package.json`);
  let reporters = ['default'];

  if (process.env.DEPLOYMENT === 'ci') {
    reporters = [['github-actions', { silent: false }], 'summary'];
  }

  return {
    testEnvironment: 'node',
    reporters,
    testMatch: ['<rootDir>/**/__tests__/**/*.test.[t]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    roots: [`<rootDir>`],
    rootDir: dir,
    displayName: packageObj.name.split('/')[1],
    modulePaths: ['.'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
      '^@app/config/env.js': '<rootDir>/../config/env.ts',
    },
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          tsconfig: `${dir}tsconfig.spec.json`,
          useESM: true,
        },
      ],
    },
  };
};
