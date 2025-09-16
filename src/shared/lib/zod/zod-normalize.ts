import { z, type ZodEffects, type ZodNumber, type ZodString, type ZodTypeAny } from 'zod'

// Для строк
export const stringNormalizeLogic = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }
  return value
}

// Для чисел
export const numberNormalizeLogic = (value: unknown) => {
  if (value === null) return null
  if (value === undefined) return undefined

  if (typeof value === 'string') {
    // Убираем пробелы в начале и конце строки
    const trimmed = value.trim()
    if (trimmed === '') return undefined

    // Заменяем "," на "."
    const replaced = trimmed.replace(',', '.')

    return Number(replaced)
  }
  return value
}

// Рекурсивно "разворачиваем" схему, чтобы найти ядро
export function getCoreSchema<T extends ZodTypeAny>(schema: T): ZodTypeAny {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return getCoreSchema(schema.unwrap() as ZodTypeAny)
  }
  if (schema instanceof z.ZodEffects) {
    return getCoreSchema(schema.innerType() as ZodTypeAny)
  }
  return schema
}

/** Нормализуем значение согласно типу ядра схемы (то же, что делает zn) */
export function normalizeBySchema<T extends ZodTypeAny>(schema: T, value: unknown): unknown {
  const core = getCoreSchema(schema)
  if (core instanceof z.ZodString) return stringNormalizeLogic(value)
  if (core instanceof z.ZodNumber) return numberNormalizeLogic(value)
  return value
}

// Перегрузки
function zn<T extends ZodNumber>(schema: T): ZodEffects<T>
function zn<T extends ZodString>(schema: T): ZodEffects<T>
function zn<T extends ZodTypeAny>(schema: T): T

function zn<T extends ZodTypeAny>(schema: T): ZodEffects<T> | T {
  // Получаем ядро схемы, чтобы проверить его тип
  const coreSchema = getCoreSchema(schema as ZodTypeAny)

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
