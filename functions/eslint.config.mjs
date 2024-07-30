import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginImport from 'eslint-plugin-import'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ['dist/*'],
  },
  {
    plugins: {
      import: { rules: eslintPluginImport.rules },
    },
    rules: {
      quotes: ['error', 'single'],
      'import/no-unresolved': 0,
      'object-curly-spacing': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_.+' }],
    },
  },
  eslintPluginPrettierRecommended,
)
