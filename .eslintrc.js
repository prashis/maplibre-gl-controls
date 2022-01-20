module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    'eslint-config-xxx',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'operator-linebreak': [2, 'before'],
  },
};
