import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
  {
    ignores: ['.nuxt/*', '.output/*'],
  },
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'import/no-named-as-default-member': ['off'],
      'vue/multi-word-component-names': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-floating-promises': ['off'],
    },
  },
  {
    files: ['./layouts/**/*.vue', './pages/**/*.vue', '**/index.vue', 'error.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  eslintPluginPrettierRecommended,
)
