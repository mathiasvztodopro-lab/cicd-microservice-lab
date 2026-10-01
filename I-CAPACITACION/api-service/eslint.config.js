// ESLint 10 usa "flat config" (eslint.config.js). El formato antiguo
// .eslintrc.json fue removido en ESLint 9, por eso esta equivalencia del
// material original: eslint:recommended + plugin:@typescript-eslint/recommended
// viven ahora dentro de tseslint.configs.recommended.
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);