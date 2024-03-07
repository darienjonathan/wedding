module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:vue/vue3-recommended',
    'plugin:prettier-vue/recommended',
    '@nuxtjs/eslint-config-typescript',
    '@nuxtjs/eslint-config',
    'prettier',
  ],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'prettier/prettier': 'error',
    'prefer-const': 'error',
    'import/no-named-as-default-member': ['off'], // doing import { unix } as 'dayjs' results in error in the built file
    'vue/multi-word-component-names': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-floating-promises': ['off'],
  },
  overrides: [
    {
      files: ['./layouts/**/*.vue', './pages/**/*.vue', './**/index.vue'],
      rules: {
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      files: ['./**/*.vue'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  ignorePatterns: ['.eslintrc.js'],
}
