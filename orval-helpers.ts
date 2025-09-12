import fs from 'fs'
import { OpenAPIV3 } from 'openapi-types'

/**
 * Анализирует OpenAPI схему и находит все операции, которые возвращают не-JSON ответы.
 * @param schemaPath - Путь к файлу openapi.json.
 * @returns Объект с override-конфигурацией для orval.
 */
export function generateFileOverrides(schemaPath: string): object {
  const fileContent = fs.readFileSync(schemaPath, 'utf-8')

  const schema = JSON.parse(fileContent) as OpenAPIV3.Document
  const overrides: Record<string, unknown> = {}

  if (!schema.paths) {
    return overrides
  }

  for (const path in schema.paths) {
    const pathItem = schema.paths[path]
    if (!pathItem) {
      continue
    }

    for (const method in pathItem) {
      // 2. Теперь эта строка работает, так как OpenAPIV3.HttpMethods существует в рантайме
      if (!Object.values(OpenAPIV3.HttpMethods).includes(method as OpenAPIV3.HttpMethods)) {
        continue
      }

      const operation = pathItem[method as OpenAPIV3.HttpMethods] as OpenAPIV3.OperationObject
      const operationId = operation.operationId
      const successResponse = operation.responses?.['200'] ?? operation.responses?.['201']

      if (operationId && successResponse && '$ref' in successResponse === false) {
        if (successResponse.content) {
          const contentTypes = Object.keys(successResponse.content)
          const isFileResponse = !contentTypes.includes('application/json')

          if (isFileResponse) {
            console.log(`[Orval Config] Applying file mutator for: ${operationId}`)
            overrides[operationId] = {
              mutator: {
                path: './src/shared/api/mutator.ts',
                name: 'fileMutator',
              },
            }
          }
        }
      }
    }
  }

  return overrides
}
