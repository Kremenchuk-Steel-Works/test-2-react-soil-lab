import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Для сгенерированных orval/msw файлов
  {
    files: ['**/*.msw.ts'],
    rules: {
      // "unknown" в union поглощает остальные типы
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      // Генератор часто оставляет Function/unknown
      '@typescript-eslint/no-unsafe-call': 'off',

      // Эти файлы не содержат React-компонентов
      'react-refresh/only-export-components': 'off',
    },
  },
)
