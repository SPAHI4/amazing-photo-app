import baseConfig from '../jest.config.base.js';

const dirname = new URL('.', import.meta.url).pathname;

export default {
  ...baseConfig(dirname),
  maxConcurrency: 1,
};
