import type { Brand } from '@/app/routes/types'

/** Сборщик "a.b.c" из tuple на уровне типов */
export type DotJoin<T extends readonly string[], Acc extends string = ''> = T extends readonly [
  infer H extends string,
  ...infer R extends readonly string[],
]
  ? DotJoin<R, Acc extends '' ? H : `${Acc}.${H}`>
  : Acc

/** Итоговый тип ключа с учётом префикса и суффикса */
export type WithSuffix<
  P extends readonly string[],
  S extends readonly string[],
> = S['length'] extends 0 ? DotJoin<P> : `${DotJoin<P>}.${DotJoin<S>}`

/**
 * Названия для ключей маршрутов.
 * Возвращает функцию-генератор ключей с точечной нотацией, БЕЗ any.
 * Пример: const RK = createRouteKeyNs('soilLab','moldingMixtures','samples');
 * RK() -> "soilLab.moldingMixtures.samples"
 * RK('detail') -> "soilLab.moldingMixtures.samples.detail"
 */
export function createRouteKeyNs<const Parts extends readonly string[]>(...parts: Parts) {
  const prefix = parts.join('.') as DotJoin<Parts>
  return <const Suffix extends readonly string[]>(
    ...suffix: Suffix
  ): Brand<WithSuffix<Parts, Suffix>, 'RouteKey'> => {
    const key = (suffix.length ? `${prefix}.${suffix.join('.')}` : prefix) as WithSuffix<
      Parts,
      Suffix
    >
    // Брендируем строку как RouteKey, чтобы не путать с произвольным string
    return key as Brand<typeof key, 'RouteKey'>
  }
}
