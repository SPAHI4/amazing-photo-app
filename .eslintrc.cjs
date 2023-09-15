module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    // allow console and default export only outside of src/ (scripts, config, etc.)
    {
      files: ['**/src/**'],
      rules: {
        'no-console': 'warn',
        'import/no-default-export': 'error',
      },
    },
    // allow .ts import for tests
    {
      files: ['**/__tests__/**', '**/e2e/**'],
      rules: {
        'import/extensions': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  rules: {
    curly: 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'import/order': 'warn',
    'no-underscore-dangle': ['warn', { allow: ['_id', '__typename', '__filename', '__dirname'] }],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': 'off', // handled by typescript compiler
    '@typescript-eslint/no-unnecessary-condition': 'error',
    'no-restricted-syntax': 'off', // since we target modern browsers, we can use for-of
    'sql/format': [
      'error',
      {
        ignoreExpressions: false,
        ignoreInline: true,
        ignoreTagless: false,
        ignoreBaseIndent: true,
      },
    ],
    'sql/no-unsafe-query': 'off',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'sql'],
  parserOptions: {
    root: true,
    project: [
      `${__dirname}/tsconfig.json`,
      `${__dirname}/config/tsconfig.json`,
      `${__dirname}/client/tsconfig.json`,
      `${__dirname}/client/tsconfig.node.json`,
      `${__dirname}/server/tsconfig.json`,
      `${__dirname}/worker/tsconfig.json`,

      `${__dirname}/db/tsconfig.spec.json`,
      `${__dirname}/server/tsconfig.spec.json`,

      `${__dirname}/e2e/cypress/tsconfig.json`,
    ],
  },
};
