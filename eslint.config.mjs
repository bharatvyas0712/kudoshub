import js from '@eslint/js';

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
  module: 'readonly',
  require: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly'
};

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  console: 'readonly',
  Event: 'readonly',
  CustomEvent: 'readonly',
  FormData: 'readonly',
  URL: 'readonly',
  crypto: 'readonly',
  localStorage: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly'
};

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**']
  },
  js.configs.recommended,
  {
    files: ['backend/**/*.js', 'backend/**/*.cjs', '*.js', '*.cjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: nodeGlobals
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['frontend/**/*.js', 'frontend/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z]' }]
    }
  }
];