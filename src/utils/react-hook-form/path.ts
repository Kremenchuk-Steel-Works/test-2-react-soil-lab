import type { ArrayPath, DeepPartial, FieldValues, PathValue } from 'react-hook-form'

// Достаёт тип элемента массива
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : T extends (infer U)[] ? U : never

/**
 * Делает значение "именем массива" формы.
 * Если путь не существует в форме — срежется до never, и вызов упадёт компиляцией.
 */
export function arrayPath<T extends FieldValues, S extends string>(s: S): Extract<ArrayPath<T>, S> {
  // единственный локализованный cast — в одном месте проекта
  return s as Extract<ArrayPath<T>, S>
}

/**
 * Типобезопасно "подтверждает" defaultItem как элемент массива по пути N.
 * В рантайме это просто identity, но для TS это контракт, исключающий `as` снаружи.
 */
export function ensureDefaultItem<T extends FieldValues, N extends ArrayPath<T>>(
  v: DeepPartial<ArrayElement<PathValue<T, N>>>,
) {
  return v
}
