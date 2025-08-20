import { z, type ZodTypeAny } from 'zod'

// Для строк
const stringNormalize = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      return trimmed === '' ? undefined : trimmed
    }
    return value
  }, schema)
}

// Для чисел
const numberNormalize = <T extends ZodTypeAny>(schema: T) => {
  return z.preprocess((value) => {
    if (value === null) return null
    if (value === undefined) return undefined

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed === '') return undefined

      const num = Number(trimmed)
      // Возвращаем NaN, если строка не числовая.
      // Схема z.number() ниже корректно обработает NaN как ошибку.
      return num
    }

    return value
  }, schema)
}

/**
 * Объект с типобезопасными нормализаторами для Zod-схем.
 * Принимает готовую схему и добавляет к ней слой предобработки.
 * @example
 * name: zodNormalize.string(z.string().min(1)), // Обязательное поле
 * age: zodNormalize.number(z.number().positive().optional()), // Опциональное поле
 */
export const zn = {
  string: stringNormalize,
  number: numberNormalize,
}
