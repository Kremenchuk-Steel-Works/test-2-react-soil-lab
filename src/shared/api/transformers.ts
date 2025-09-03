/**
 * Рекурсивный тип, который заменяет все вхождения `null` на `undefined`.
 */
type NullsToUndefined<T> = T extends null
  ? undefined
  : T extends Date // Исключаем объекты, которые не нужно обходить, например Date
    ? T
    : T extends object
      ? { [K in keyof T]: NullsToUndefined<T[K]> }
      : T

/**
 * Recursively converts all `null` values in an object to `undefined`.
 * This is useful for cleaning up API responses before they are used in the application,
 * aligning them with TypeScript's preference for `undefined` for optional properties.
 * @param obj The object to clean.
 * @returns A new object with `null` values replaced by `undefined`.
 */
export function nullsToUndefined<T>(obj: T): NullsToUndefined<T> {
  if (obj === null || obj === undefined) {
    return undefined as NullsToUndefined<T>
  }

  if (typeof obj !== 'object') {
    return obj as NullsToUndefined<T>
  }

  if (Array.isArray(obj)) {
    return (obj as unknown[]).map((item) => nullsToUndefined(item)) as NullsToUndefined<T>
  }

  // Используем reduce для создания нового объекта без мутаций и `any`
  return (Object.keys(obj) as Array<keyof T>).reduce(
    (acc, key) => {
      const value = obj[key]
      acc[key] = nullsToUndefined(value)
      return acc
    },
    {} as { [K in keyof T]: NullsToUndefined<T[K]> },
  ) as NullsToUndefined<T>
}
