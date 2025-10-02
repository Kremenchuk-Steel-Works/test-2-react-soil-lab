export type ValueOf<T> = T[keyof T]

/** Преобразование snake_case → camelCase (типового уровня) */
export type SnakeToCamel<S extends string> = S extends `${infer H}_${infer T}`
  ? `${H}${Capitalize<SnakeToCamel<T>>}`
  : S
export type SnakeToCamelUnion<U extends string> = U extends unknown
  ? SnakeToCamel<Lowercase<U>>
  : never

/** Обратное преобразование (полезно для сигнатур/утилит у границы API) */
export type CamelToSnake<S extends string> = S extends `${infer C}${infer R}`
  ? C extends Lowercase<C>
    ? `${C}${CamelToSnake<R>}`
    : `_${Lowercase<C>}${CamelToSnake<R>}`
  : S
