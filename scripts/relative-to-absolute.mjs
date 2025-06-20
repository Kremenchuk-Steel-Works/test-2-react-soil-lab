// scripts/relative-to-absolute.mjs
import fs from 'fs'
import path from 'path'

function getTsConfig() {
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Указываем скрипту читать tsconfig.app.json, где лежат реальные настройки
  const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.app.json')

  if (!fs.existsSync(tsConfigPath)) {
    throw new Error(`FATAL: The config file was not found at: ${tsConfigPath}`)
  }

  let tsConfigFile
  try {
    tsConfigFile = fs.readFileSync(tsConfigPath, 'utf-8')
  } catch (e) {
    throw new Error(`FATAL: Could not read ${tsConfigPath}. Error: ${e.message}`)
  }

  let tsConfig
  try {
    tsConfig = JSON.parse(tsConfigFile)
  } catch (error) {
    console.error(
      `FATAL: Failed to parse ${tsConfigPath}. Please make sure it is a valid JSON file without any comments (// or /* */).`,
    )
    throw error
  }

  return tsConfig
}

const tsConfig = getTsConfig()

if (!tsConfig || typeof tsConfig.compilerOptions !== 'object') {
  console.error('Parsed config content:', JSON.stringify(tsConfig, null, 2))
  throw new Error(
    'FATAL: `compilerOptions` object not found in your config. Please check the file.',
  )
}

const { baseUrl, paths } = tsConfig.compilerOptions

if (!baseUrl || !paths) {
  console.error(
    'Parsed compilerOptions content:',
    JSON.stringify(tsConfig.compilerOptions, null, 2),
  )
  throw new Error('FATAL: `baseUrl` and `paths` must be defined in your compilerOptions.')
}

const aliasConfig = Object.entries(paths)
  .map(([alias, aliasPaths]) => {
    if (aliasPaths.length === 0) return null
    return {
      alias: alias.replace('/*', ''),
      path: aliasPaths[0].replace('./', '').replace('/*', ''), // Обработка `./src/*`
    }
  })
  .filter(Boolean)

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  const currentFilePath = file.path

  root.find(j.ImportDeclaration).forEach((importPath) => {
    const importSource = importPath.node.source.value

    if (!importSource || !importSource.startsWith('.')) {
      return
    }

    const resolvedImportPath = path.resolve(path.dirname(currentFilePath), importSource)
    const projectRoot = process.cwd()
    const resolvedBaseUrl = path.resolve(projectRoot, baseUrl)
    const relativeToBasePath = path.relative(resolvedBaseUrl, resolvedImportPath)

    if (relativeToBasePath.startsWith('..')) {
      return
    }

    const matchingAlias = aliasConfig.find((config) => relativeToBasePath.startsWith(config.path))

    if (matchingAlias) {
      const newImportPath = path
        .join(matchingAlias.alias, relativeToBasePath.substring(matchingAlias.path.length))
        .replace(/\\/g, '/')

      console.log(
        `Rewriting "${importSource}" to "${newImportPath}" in ${path.relative(
          projectRoot,
          currentFilePath,
        )}`,
      )

      importPath.node.source = j.stringLiteral(newImportPath)
    }
  })

  return root.toSource({ quote: 'single', trailingComma: true })
}
