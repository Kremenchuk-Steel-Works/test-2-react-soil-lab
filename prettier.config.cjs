/** @type {import('prettier').Config} */
const config = {
  printWidth: 100,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // всегда последний
  ],
  importOrder: [
    '^react$',
    '^next',
    '^@?\\w',
    '^(@|~)/',
    '^\\.\\.(?!/?$)',
    '^\\./(?=.*/)(?!/?$)',
    '^\\.(?!/?$)',
    '^.+\\.s?css$',
    '^\\u0000',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
}

module.exports = config
