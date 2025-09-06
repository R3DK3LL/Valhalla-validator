const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/**', 'venv/**'],
    rules: {
      'no-debugger': 'error'
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    }
  }
];
