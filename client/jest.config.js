// eslint-disable-next-line import/no-relative-packages
import baseConfig from '../jest.config.base.js';

const dirname = new URL('.', import.meta.url).pathname;

export default {
  reporters: baseConfig(dirname).reporters,
  displayName: 'client',
  testMatch: ['<rootDir>/**/*.test.[t]s?(x)'],
  // we have some issues with esm handling
  moduleNameMapper: {
    '@apollo/client/testing': '@apollo/client/testing/index.js',
    'date-fns/esm': 'date-fns',
    'react-use/esm': 'react-use',
  },
  testEnvironment: '@happy-dom/jest-environment',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'lcov'],
  coverageDirectory: 'coverage',
};
