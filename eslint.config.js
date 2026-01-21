const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const prettierPlugin = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

const baseIgnores = [
  '**/*.cjs',
  '**/.history/**',
  'eslint.config.js',
  'jest.config.ts',
  'prettier.config.cjs',
  'vite.config.ts',
  'setupTests.ts'
];

const projectIgnores = ['dist', 'coverage', 'node_modules', 'playwright-report', 'test-results'];

const testFilePatterns = [
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.test.js',
  '**/*.test.jsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.spec.js',
  '**/*.spec.jsx',
  'tests/**/*.{ts,tsx,js,jsx}',
  'src/**/__tests__/**/*.{ts,tsx,js,jsx}'
];

const jsxA11yFlat = {
  name: 'jsx-a11y/recommended',
  plugins: { 'jsx-a11y': jsxA11y },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  },
  rules: jsxA11y.configs.recommended.rules
};


module.exports = [
  {
    name: 'base/ignores',
    ignores: baseIgnores
  },
  {
    name: 'project/ignores',
    ignores: projectIgnores
  },
  {
    name: 'base/language',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    }
  },
  {
    name: 'project/tests',
    files: testFilePatterns,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest
      }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11yFlat,
  {
    name: 'project/custom',
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'prettier/prettier': 'error'
    }
  },
  eslintConfigPrettier
];
