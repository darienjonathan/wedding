import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'import/no-named-as-default-member': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-floating-promises': ['off'],
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
)
