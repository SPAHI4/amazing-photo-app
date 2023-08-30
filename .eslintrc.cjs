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
    // turn off prettier for ts 5.2 files
    {
      files: [`**/convert-image.ts`],
      plugins: ['@typescript-eslint', 'sql'],
      rules: {
        'prettier/prettier': 'off',
      },
    },
    // allow .ts import for tests
    {
      files: ['**/__tests__/**'],
      rules: {
        'import/extensions': 'off',
      },
    },
  ],
  rules: {
    curly: 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'import/order': 'warn',
    'no-underscore-dangle': ['warn', { allow: ['_id', '__typename', '__filename', '__dirname'] }],
    '@typescript-eslint/no-shadow': ['error'],
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
      './tsconfig.json',
      './config/tsconfig.json',
      './client/tsconfig.json',
      './client/tsconfig.node.json',
      './server/tsconfig.json',
      './worker/tsconfig.json',
      './db/tsconfig.json',

      './tsconfig.spec.json',
      './db/__tests__/tsconfig.json',
    ],
  },
};
