import { z, type ZodEffects, type ZodNumber, type ZodString, type ZodTypeAny } from 'zod'

// Для строк
const stringNormalizeLogic = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }
  return value
}

// Для чисел
const numberNormalizeLogic = (value: unknown) => {
  if (value === null) return null
  if (value === undefined) return undefined
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return undefined
    return Number(trimmed)
  }
  return value
}

// Рекурсивно "разворачиваем" схему, чтобы найти ядро
function getCoreSchema(schema: ZodTypeAny): ZodTypeAny {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return getCoreSchema(schema.unwrap())
  }
  if (schema instanceof z.ZodEffects) {
    return getCoreSchema(schema.innerType())
  }
  return schema
}

// Перегрузки
function zn<T extends ZodNumber>(schema: T): ZodEffects<T>
function zn<T extends ZodString>(schema: T): ZodEffects<T>
function zn<T extends ZodTypeAny>(schema: T): T

function zn(schema: ZodTypeAny) {
  // Получаем ядро схемы, чтобы проверить его тип
  const coreSchema = getCoreSchema(schema)

  // Проверяем тип ядра
  if (coreSchema instanceof z.ZodString) {
    return z.preprocess(stringNormalizeLogic, schema)
  }

  if (coreSchema instanceof z.ZodNumber) {
    return z.preprocess(numberNormalizeLogic, schema)
  }

  return schema
}

export { zn }
