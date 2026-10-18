// Regras de código (ESLint). Os arquivos .tsx são conferidos pelo tsc (npm run lint --prefix lps).
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'dist-server/**', 'node_modules/**', 'lps/**', 'src/analytics/**', '.referencia/**', '.visual*/**'] },
  js.configs.recommended,
  { files: ['**/*.mjs', 'eslint.config.js'], languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: globals.node } },
  // Os testes passam funções para o navegador (page.evaluate), então também usam os globais dele.
  { files: ['tests/**/*.mjs'], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  // O analytics.js é montado de várias partes (src/analytics): conferimos o arquivo final.
  { files: ['public/js/**/*.js', 'dist/js/*.js'], languageOptions: { ecmaVersion: 2023, sourceType: 'script', globals: globals.browser } },
  { rules: { 'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }], 'no-empty': ['error', { allowEmptyCatch: true }] } },
];
