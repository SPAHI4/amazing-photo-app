module.exports = {
  env: { node: true, es2022: true },
  extends: ['airbnb', '../.eslintrc.cjs'],
  rules: {
    'no-restricted-syntax': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
    'react/require-default-props': 'off',
    'react/jsx-key': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
  },
  parserOptions: {
    lib: ['es2022'],
  },
};
