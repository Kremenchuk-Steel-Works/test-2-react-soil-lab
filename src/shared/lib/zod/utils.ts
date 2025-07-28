import { z, ZodType, type ZodTypeAny } from 'zod'

/**
 * Преобразует Zod-схему объекта в опциональную.
 * Если все поля объекта пустые строки или undefined, весь объект становится undefined.
 * Полезно для опциональных групп полей в формах.
 */
export default function optionalObject<T extends ZodTypeAny>(
  schema: T,
): ZodType<z.infer<T> | undefined> {
  return z.preprocess(
    (val) => {
      // Если все поля пустые – возвращаем undefined
      if (
        val &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        Object.values(val).every((v) => v === undefined || v === '')
      ) {
        return undefined
      }
      return val
    },
    z.union([schema, z.undefined()]),
  )
}

/**
 * Преобразует пустое значение ('', null, undefined) в undefined, иначе в число.
 * Используется в z.preprocess для числовых полей.
 */
export const parseNumber = (v: unknown) =>
  v === '' || v === null || v === undefined ? undefined : Number(v)

/**
 * Преобразует массив объектов с полем 'value' в кортеж строк,
 * подходящий для z.enum().
 */
export const toZodEnumValues = <T extends readonly { value: string }[]>(options: T) =>
  options.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]]
