module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  plugins: [
    '@typescript-eslint',
    'n8n-nodes-base',
  ],
  extends: [
    'eslint:recommended',
    'plugin:n8n-nodes-base/community',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'n8n-nodes-base/node-filename-against-convention': 'error',
    'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
    'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
};
