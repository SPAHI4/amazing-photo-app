import { defineConfig } from 'cypress';

process.env.DEPLOYMENT = 'ci';
const { env } = await import('@app/config/env.js');

/**
 * @type {Cypress.PluginConfig}
 */
export default defineConfig({
  e2e: {
    testIsolation: false,
    env,
    setupNodeEvents(on, config) {
      if (process.env.CI) {
        // CI seems to be pretty slow, lets be more forgiving
        config.defaultCommandTimeout = 20000; // default 4000
        config.requestTimeout = 10000; // default 5000
      }
    },
  },
});
