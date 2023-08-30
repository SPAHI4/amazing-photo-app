/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  projects: [
    '<rootDir>/client/jest.config.js',
    '<rootDir>/server/jest.config.js',
    '<rootDir>/worker/jest.config.js',
    '<rootDir>/db/jest.config.js',
    '<rootDir>/e2e/jest.config.js',
  ],
};
