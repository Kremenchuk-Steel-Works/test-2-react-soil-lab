import type { ReadonlyDeep } from 'type-fest'

/** Строковые ключи из типа T */
export type KeysOf<T> = Extract<keyof T, string>

/** База для меток */
type LabelBase = Readonly<{
  default: string
  short?: string
  full?: string
}>
type ExtensibleLabels = Readonly<LabelBase & { [extra: string]: string | undefined }>

/** Токен (элемент реестра) */
export type FieldToken<K extends string, L extends ExtensibleLabels = ExtensibleLabels> = Readonly<{
  key: K
  label: L
}>

/** Вход: сырые метки или готовый токен */
type FieldInput<L extends ExtensibleLabels = ExtensibleLabels> =
  | Readonly<{ label: L }>
  | FieldToken<string, L>

/** Форма входа. K — допустимый набор ключей. */
type LabelsShape<
  K extends string = string,
  L extends ExtensibleLabels = ExtensibleLabels,
> = Readonly<Record<K, FieldInput<L>>>

/** Результат: отображение ключей на токены */
export type Registry<M extends LabelsShape> = {
  readonly [K in Extract<keyof M, string>]: FieldToken<
    K,
    M[K] extends FieldInput<infer L> ? Readonly<L & ExtensibleLabels> : never
  >
}

/** Хелпер-проверка: ключи M должны быть подмножеством Allowed */
type EnforceKeysSubset<M extends LabelsShape, Allowed extends string> =
  Extract<keyof M, string> extends Allowed ? M : never

/** Сигнатура публичной фабрики */
type CreateFieldRegistry = {
  <const M extends LabelsShape>(labels: ReadonlyDeep<M>): Registry<M>

  /** Ограничить ключи до подмножества KeysOf<T> */
  forType<T>(): <const M extends LabelsShape>(
    labels: ReadonlyDeep<EnforceKeysSubset<M, KeysOf<T>>>,
  ) => Registry<M>

  /** Ограничить ключи до подмножества произвольного union-а */
  forKeys<Allowed extends string>(): <const M extends LabelsShape>(
    labels: ReadonlyDeep<EnforceKeysSubset<M, Allowed>>,
  ) => Registry<M>
}

/** Реализация базовой фабрики */
function _createFieldRegistry<const M extends LabelsShape>(labels: ReadonlyDeep<M>): Registry<M> {
  type Key = Extract<keyof M, string>
  type Out = {
    [K in Key]: FieldToken<
      K,
      M[K] extends FieldInput<infer L> ? Readonly<L & ExtensibleLabels> : never
    >
  }

  const out = {} as Partial<Out>

  for (const k of Object.keys(labels) as Key[]) {
    const { label } = labels[k] as FieldInput
    out[k] = Object.freeze({
      key: k,
      label: Object.freeze(label),
    }) as Out[typeof k]
  }

  return Object.freeze(out) as Out
}

/** Экспорт без namespace + «статические» методы через Object.assign */
export const createFieldRegistry: CreateFieldRegistry = Object.assign(_createFieldRegistry, {
  forType<T>() {
    return function <const M extends LabelsShape>(
      labels: ReadonlyDeep<EnforceKeysSubset<M, KeysOf<T>>>,
    ): Registry<M> {
      return _createFieldRegistry(labels)
    }
  },
  forKeys<Allowed extends string>() {
    return function <const M extends LabelsShape>(
      labels: ReadonlyDeep<EnforceKeysSubset<M, Allowed>>,
    ): Registry<M> {
      return _createFieldRegistry(labels)
    }
  },
})
