/**
 * Recursively converts all `null` values in an object to `undefined`.
 * This is useful for cleaning up API responses before they are used in the application,
 * aligning them with TypeScript's preference for `undefined` for optional properties.
 * @param obj The object to clean.
 * @returns A new object with `null` values replaced by `undefined`.
 */
export function nullsToUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return undefined as any
  }

  // Если это не объект (например, строка, число) или массив, возвращаем как есть
  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => nullsToUndefined(item)) as any
  }

  // Рекурсивно обрабатываем ключи объекта
  const newObj = { ...obj }
  for (const key in newObj) {
    if (newObj.hasOwnProperty(key)) {
      ;(newObj as any)[key] = nullsToUndefined((newObj as any)[key])
    }
  }

  return newObj
}
