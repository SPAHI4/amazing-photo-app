// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  env: { browser: true, es2020: true },
  extends: ['plugin:react-hooks/recommended', '../.eslintrc.cjs'],
  ignorePatterns: [path.resolve(__dirname, '../.eslintignore'), '__generated__'],
  plugins: ['react-refresh', '@emotion'],
  rules: {
    'no-console': 'off', // TODO: use logger
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'import/extensions': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
    'react/require-default-props': 'off',
    'react/jsx-key': 'error',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react-hooks/exhaustive-deps': 'error',
  },
  overrides: [
    {
      files: ['vite.config.ts', 'scripts/**/*.ts'],
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.node.json'),
      },
    },
  ],
};
