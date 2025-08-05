import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

// --- Конфигурация и проверка ---
const config = JSON.parse(readFileSync('./api-services.config.json', 'utf-8'))
const serviceName = process.argv[2]

if (!serviceName) {
  console.error('❌ Ошибка: Не указано имя сервиса.')
  console.log('✅ Пример: npm run api main')
  process.exit(1)
}

const service = config[serviceName]

if (!service) {
  console.error(`❌ Ошибка: Сервис с именем "${serviceName}" не найден в api-services.config.json.`)
  process.exit(1)
}

const { url, path: servicePath } = service

// --- Пути к файлам ---
if (!existsSync(servicePath)) {
  mkdirSync(servicePath, { recursive: true })
}

const openapiJsonPath = path.join(servicePath, 'openapi.json')
const schemaTsPath = path.join(servicePath, 'schema.ts')
const casingFilePath = 'casing.yaml'

// --- Процесс генерации ---
try {
  console.log(`🚀 [${serviceName}] Получение и форматирование схемы...`)
  execSync(`npx openapi-format ${url} -o ${openapiJsonPath} --casingFile ${casingFilePath}`, {
    stdio: 'inherit',
  })
  console.log(`\n🎉 [${serviceName}] Готово! Файл openapi.json успешно сгенерирован.`)
} catch (error) {
  console.error(`❌ [${serviceName}] Произошла ошибка во время генерации API:`, error.message)
  process.exit(1)
}
