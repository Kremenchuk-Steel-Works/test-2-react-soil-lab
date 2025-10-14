import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createOrvalConfig } from '../orval.config.template'

// --- Типизация конфига для надежности ---
interface ServiceConfig {
  url: string
  path: string
}
type ApiConfig = Record<string, ServiceConfig>

function isApiConfig(x: unknown): x is ApiConfig {
  if (!x || typeof x !== 'object') return false
  for (const v of Object.values(x as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') return false
    const svc = v as Record<string, unknown>
    if (typeof svc.url !== 'string' || typeof svc.path !== 'string') return false
  }
  return true
}

function readApiConfig(): ApiConfig {
  const raw = readFileSync('./api-services.config.json', 'utf-8')
  const parsed: unknown = JSON.parse(raw)
  if (!isApiConfig(parsed)) {
    throw new Error('Invalid api-services.config.json: expected { [name]: { url, path } }')
  }
  return parsed
}

function isHttpUrl(u: string): boolean {
  return /^https?:\/\//i.test(u)
}

function isFileUrl(u: string): boolean {
  return /^file:\/\//i.test(u)
}

async function downloadSchema(src: string, outFile: string): Promise<void> {
  // http/https — грузим через fetch, локальные — копируем через fs
  if (isHttpUrl(src)) {
    const res = await fetch(src, {
      headers: { accept: 'application/json, application/yaml, text/yaml, */*' },
    })
    if (!res.ok) {
      throw new Error(`Failed to download schema: ${res.status} ${res.statusText}`)
    }
    const ab = await res.arrayBuffer()
    writeFileSync(outFile, Buffer.from(ab))
    return
  }

  let localPath: string
  if (isFileUrl(src)) {
    localPath = fileURLToPath(src)
  } else {
    localPath = path.isAbsolute(src) ? src : path.resolve(process.cwd(), src)
  }

  if (!existsSync(localPath)) {
    throw new Error(`Local schema not found at ${localPath}`)
  }

  const data = readFileSync(localPath)
  writeFileSync(outFile, data)
}

// --- Основная логика ---

const run = async (): Promise<void> => {
  const config = readApiConfig()
  const serviceArg = process.argv[2]

  const servicesToGenerate = serviceArg ? [serviceArg] : Object.keys(config)

  if (serviceArg && !config[serviceArg]) {
    console.error(
      `❌ Ошибка: Сервис с именем "${serviceArg}" не найден в api-services.config.json.`,
    )
    process.exit(1)
  }

  console.log(`🚀 Начинаем генерацию для сервисов: ${servicesToGenerate.join(', ')}`)

  for (const serviceName of servicesToGenerate) {
    await generateServiceAPI(serviceName, config[serviceName])
  }

  console.log('\n✅ Все операции успешно завершены!')
}

const generateServiceAPI = async (name: string, service: ServiceConfig): Promise<void> => {
  console.log(`\n--- Генерация для [${name}] ---`)

  const { url, path: servicePath } = service

  // Создание директории
  if (!existsSync(servicePath)) {
    mkdirSync(servicePath, { recursive: true })
  }

  const openapiJsonPath = path.join(servicePath, 'openapi.json')

  // Шаг 1: Получение OpenAPI схемы (без форматирования/кастомного casing)
  try {
    console.log(`[${name}] Шаг 1/2: Загрузка схемы из ${url}...`)
    await downloadSchema(url, openapiJsonPath)
    console.log(`[${name}] ✅ Схема сохранена: ${openapiJsonPath}`)
  } catch (error) {
    console.error(`[${name}] ❌ Ошибка при загрузке схемы:`, (error as Error).message)
    process.exit(1)
  }

  // Шаг 2: Генерация кода с помощью Orval
  try {
    console.log(`[${name}] Шаг 2/2: Генерация TypeScript-кода с помощью Orval...`)

    const orval = (await import('orval')).default
    const orvalConfig = createOrvalConfig(name, servicePath)

    for (const projectConfig of Object.values(orvalConfig)) {
      await orval(projectConfig)
    }

    console.log(`[${name}] ✅ Код клиента API успешно сгенерирован.`)
  } catch (error) {
    console.error(`[${name}] ❌ Ошибка на этапе генерации Orval:`, (error as Error).message)
    process.exit(1)
  }
}

void run()
