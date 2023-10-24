/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import codegen from 'vite-plugin-graphql-codegen';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  server: {
    https: {
      key: '../cert-local/localhost.decrypted.key',
      cert: '../cert-local/localhost.crt',
    },
  },
  optimizeDeps: {
    // for some reason pnpm patch is not included in the bundle
    exclude: ['react-router-dom', '@remix-run/router'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      // remove .test files from bundle
      external: [/\.test\.(ts|tsx|js|jsx|mjs)$/],
      output: {
        format: 'es',
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          styles: [
            '@emotion/react',
            '@emotion/styled',
            '@mui/styled-engine',
            '@mui/material/styles',
          ],
          graphql: [
            './src/apollo-client.ts',
            'graphql',
            '@apollo/client',
            'apollo-link-token-refresh',
          ],
          // muix gets quite big, but it's ok because it's only used in admin
          muix: ['@mui/x-data-grid'],
        },
      },
    },
  },
  plugins: [
    visualizer.default() as unknown as PluginOption,
    react({
      jsxImportSource: '@emotion/react',
      plugins: [
        // fix awaiting https://github.com/dotansimha/graphql-code-generator/issues/9450
        // [
        //   '@graphql-codegen/client-preset-swc-plugin',
        //   {
        //     artifactDirectory: './src/__generated__/',
        //     gqlTagName: 'graphql',
        //   },
        // ],
        [
          '@swc/plugin-emotion',
          {
            sourceMap: true,
            autoLabel: 'always',
            labelFormat: 'hehe',
          },
        ],
      ],
    }),
    // @ts-expect-error default export type bug
    codegen({
      throwOnStart: true,
      enableWatcher: false,
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand:
          'eslint src --ext cjs,ts,tsx --report-unused-disable-directives --max-warnings 0',
      },
    }),
  ],
});
