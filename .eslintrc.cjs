module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/src/**'],
      rules: {
        'no-console': 'warn',
      },
    },
  ],
  rules: {
    curly: 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    'import/order': 'warn',
    'no-underscore-dangle': ['warn', { allow: ['_id', '__typename', '__filename', '__dirname'] }],
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-use-before-define': ['error', 'nofunc'],
    '@typescript-eslint/no-unused-vars': 'off', // handled by typescript
    'no-undef': 'off', // handled by typescript
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unnecessary-condition': 'error',

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
  // processor: '@graphql-eslint/graphql',
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
    ],
  },
};
