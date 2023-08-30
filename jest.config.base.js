import fs from 'node:fs';
// eslint-disable-next-line import/no-extraneous-dependencies,import/extensions
import preset from 'ts-jest/presets/index.js';

/** @type {(dir: string) => import('ts-jest').JestConfigWithTsJest} */
export default (dir) => {
  const packageObj = JSON.parse(fs.readFileSync(`${dir}/package.json`, 'utf8'));
  let reporters = ['default'];

  if (process.env.DEPLOYMENT === 'ci') {
    console.log('CI detected, using GitHub Actions reporter');
    reporters = [['github-actions', { silent: false }], 'summary'];
  }

  return {
    ...preset.defaultsESM,
    testEnvironment: 'node',
    reporters,
    testMatch: ['<rootDir>/**/__tests__/**/*.test.[t]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    roots: [`<rootDir>`],

    rootDir: dir,
    displayName: packageObj.name,

    transform: {
      '^.+\\.[jt]sx?$': [
        'ts-jest',
        {
          tsconfig: '../tsconfig.spec.json',
          useESM: true,
        },
      ],
    },
  };
};
