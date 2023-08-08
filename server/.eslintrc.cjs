module.exports = {
  env: { node: true, es2022: true },
  extends: ['../.eslintrc.cjs'],
  rules: {
    'no-restricted-syntax': 'off',
  },
  parserOptions: {
    lib: ['es2022'],
  },
};
