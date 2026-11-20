import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['node_modules', 'reports', 'test-results', 'cucumber.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      complexity: ['warn', 10],
      'max-depth': ['warn', 3],
      'max-lines-per-function': ['warn', 40],
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  // A describe block groups many small tests, so its callback is long by design.
  { files: ['test/unit/**/*.spec.ts'], rules: { 'max-lines-per-function': 'off' } },
);
