import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'
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
  const parsed: unknown = JSON.parse(raw) // <- больше не any
  if (!isApiConfig(parsed)) {
    throw new Error('Invalid api-services.config.json: expected { [name]: { url, path } }')
  }
  return parsed
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

const generateServiceAPI = async (name: string, service: ServiceConfig) => {
  console.log(`\n--- Генерация для [${name}] ---`)

  const { url, path: servicePath } = service

  // Создание директории
  if (!existsSync(servicePath)) {
    mkdirSync(servicePath, { recursive: true })
  }

  const openapiJsonPath = path.join(servicePath, 'openapi.json')

  // Получение и форматирование OpenAPI схемы
  try {
    console.log(`[${name}]  Шаг 1/2: Получение и форматирование схемы из ${url}...`)
    execSync(`npx openapi-format ${url} -o ${openapiJsonPath} --casingFile casing.yaml`, {
      stdio: 'inherit',
    })
    console.log(`[${name}] ✅ Схема openapi.json успешно сохранена.`)
  } catch (error) {
    console.error(`[${name}] ❌ Ошибка на этапе форматирования схемы:`, (error as Error).message)
    process.exit(1)
  }

  // Генерация кода с помощью Orval
  try {
    console.log(`[${name}] Шаг 2/2: Генерация TypeScript-кода с помощью Orval...`)

    const orval = (await import('orval')).default
    const orvalConfig = createOrvalConfig(name, servicePath)

    // Перебираем ключи в нашем конфиге ('main', 'mainZod')
    // и вызываем orval для каждого из них по отдельности.
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
