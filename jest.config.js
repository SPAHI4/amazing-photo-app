/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  projects: [
    '<rootDir>/server/jest.config.js',
    '<rootDir>/db/jest.config.js',
    '<rootDir>/e2e/jest.config.js',
    '<rootDir>/client/jest.config.js',
  ],
};
