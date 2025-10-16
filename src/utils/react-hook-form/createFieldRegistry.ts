export type KeysOf<T> = Extract<keyof T, string>

/** Развёрнутая секция: только строки, default обязателен */
export type ResolvedDict = Readonly<{ default: string } & Record<string, string>>

/** Вход секции: только строки; default обязателен */
export type SectionInput = Readonly<{ default: string } & { [k: string]: string | undefined }>

/** Спека поля: обязателен label; остальные секции — любые */
export type FieldSpecInput = Readonly<
  {
    label: SectionInput
  } & {
    [sectionName: string]: SectionInput | undefined
  }
>

/* ---------- Вывод типов результата из фактического литерала shape ---------- */

type FieldObjOf<V> = V extends (...args: unknown[]) => infer R ? R : V

type LabelSpecOf<M, K extends Extract<keyof M, string>> =
  FieldObjOf<NonNullable<M[K]>> extends { label: infer L } ? L : never

type SectionKeysOf<M, K extends Extract<keyof M, string>> = Exclude<
  keyof FieldObjOf<NonNullable<M[K]>>,
  'label'
> &
  string

type SectionSpecOf<
  M,
  K extends Extract<keyof M, string>,
  S extends SectionKeysOf<M, K>,
> = NonNullable<FieldObjOf<NonNullable<M[K]>>[S]>

/** Ровно те ключи, что объявлены в секции литерала (включая default) */
export type ResolvedDictFrom<SI> = SI extends Readonly<Record<string, unknown>> & {
  default: unknown
}
  ? Readonly<{ [P in Extract<keyof SI, string>]: string } & { default: string }>
  : never

/** Self результата (точные секции и их ключи) */
export type FieldSelfFor<M, K extends Extract<keyof M, string>> = Readonly<
  {
    readonly key: K
    readonly label: ResolvedDictFrom<LabelSpecOf<M, K>>
  } & {
    readonly [S in SectionKeysOf<M, K>]: ResolvedDictFrom<SectionSpecOf<M, K, S>>
  }
>

/** Плоский токен реестра */
export type FieldTokenFrom<M, K extends Extract<keyof M, string>> = FieldSelfFor<M, K>

/** Реестр по всему M */
export type Registry<M> = Readonly<{
  [K in Extract<keyof M, string>]: FieldTokenFrom<M, K>
}>

/* ---------- Входные формы ---------- */

/**
 * Токен, который возвращает реестр (_уже_ собранное поле).
 * Индекс-сигнатура допускает ResolvedDict, чтобы безболезненно копировать секции.
 */
type FieldTokenLike = Readonly<
  {
    readonly key: string
    readonly label: ResolvedDict
  } & { [k: string]: ResolvedDict | string }
>

/** Разрешаем: спецификацию или уже собранный токен */
type FieldSpecOrToken = FieldSpecInput | FieldTokenLike

type Shape<Allowed extends string = string> = Readonly<Partial<Record<Allowed, FieldSpecOrToken>>>

/** Экспортируемый алиас — удобно типизировать литерал на месте использования */
export type FieldRegistryShape<Allowed extends string = string> = Shape<Allowed>

/* ---------- type guards ---------- */

const hasDefault = (v: unknown): v is { default: unknown } =>
  typeof v === 'object' && v !== null && 'default' in (v as Record<string, unknown>)

const isResolvedDict = (v: unknown): v is ResolvedDict => {
  if (typeof v !== 'object' || v === null) return false
  if (!hasDefault(v)) return false
  return typeof (v as { default: unknown }).default === 'string'
}

const isFieldTokenLike = (v: unknown): v is FieldTokenLike => {
  if (typeof v !== 'object' || v === null) return false
  const rec = v as Record<string, unknown>
  if (typeof rec.key !== 'string') return false
  const lbl = rec.label
  return isResolvedDict(lbl)
}

/* ---------- utils ---------- */

function toFrozenSection(src: SectionInput | ResolvedDict, ctx: string): ResolvedDict {
  if (!hasDefault(src) || typeof (src as { default: unknown }).default !== 'string') {
    throw new Error(`FieldRegistry: section "${ctx}" must define string "default".`)
  }
  const out: Record<string, string> = {}
  for (const [k, val] of Object.entries(src)) {
    if (typeof val === 'string') out[k] = val
  }
  if (!out.default) {
    throw new Error(`FieldRegistry: section "${ctx}" must have non-empty "default".`)
  }
  return Object.freeze(out) as ResolvedDict
}

/** Конвертация: токен → спека, иначе — спека как есть */
function toSpec(v: FieldSpecOrToken): FieldSpecInput {
  if (isFieldTokenLike(v)) {
    // Копируем только секции с корректным ResolvedDict
    const sectionEntries = Object.entries(v).filter(([k]) => k !== 'key' && k !== 'label')
    const sections: Record<string, SectionInput> = {}
    for (const [k, dict] of sectionEntries) {
      if (isResolvedDict(dict)) sections[k] = dict
    }
    return { label: v.label, ...sections }
  }
  return v
}

/** Подсветка лишних ключей: ошибка будет на конкретном свойстве (тип 'never') */
type NoExtraKeys<TObj, Allowed extends PropertyKey> = TObj &
  Record<Exclude<keyof TObj, Allowed>, never>

/* ---------- Сборка реестра ---------- */

function _createFieldRegistry<const M extends Shape<string>>(shape: M): Registry<M> {
  type Key = Extract<keyof M, string>
  const out: Partial<Registry<M>> = {}

  for (const key of Object.keys(shape) as Key[]) {
    const raw = shape[key]
    if (!raw) continue

    const specObj = toSpec(raw)
    const { label: labelSpec, ...otherSections } = specObj

    const label = toFrozenSection(labelSpec, `${key}.label`)
    const sectionsFrozen: Record<string, ResolvedDict> = {}

    for (const [sectionName, sect] of Object.entries(otherSections)) {
      if (!sect) continue
      sectionsFrozen[sectionName] = toFrozenSection(sect, `${key}.${sectionName}`)
    }

    const token = Object.freeze({
      key,
      label,
      ...sectionsFrozen,
    }) as FieldTokenFrom<M, Key>

    ;(out as Record<Key, FieldTokenFrom<M, Key>>)[key] = token
  }

  return Object.freeze(out) as Registry<M>
}

/* ---------- Публичные фабрики ---------- */

type CreateFieldRegistry = {
  /** Без ограничений: строгая типизация выводится из литерала `shape` */
  <const M extends Shape<string>>(shape: M): Registry<M>

  /** Ограничение по типу T (подмножество ключей).
   * Если KeysOf<T> = string (из-за индекс-сигнатуры), вызов будет ошибкой. */
  forType<T>(): <const R extends Shape<KeysOf<T>>>(
    shape: string extends KeysOf<T> ? never : NoExtraKeys<R, KeysOf<T>>,
  ) => Registry<R>

  /** Ограничение по Allowed — ключи `shape` ⊆ Allowed.
   * Если Allowed = string, вызов будет ошибкой. */
  forKeys<Allowed extends string>(): <const R extends Shape<Allowed>>(
    shape: string extends Allowed ? never : NoExtraKeys<R, Allowed>,
  ) => Registry<R>

  /** Tuple-вариант: передай список ключей как литерал (никогда не расширится до string). */
  fromKeys<const A extends readonly [string, ...string[]]>(
    ...keys: A
  ): <const R extends Shape<A[number]>>(shape: NoExtraKeys<R, A[number]>) => Registry<R>
}

export const createFieldRegistry: CreateFieldRegistry = Object.assign(_createFieldRegistry, {
  forType<T>() {
    return function <const R extends Shape<KeysOf<T>>>(
      shape: string extends KeysOf<T> ? never : NoExtraKeys<R, KeysOf<T>>,
    ) {
      return _createFieldRegistry(shape)
    }
  },
  forKeys<Allowed extends string>() {
    return function <const R extends Shape<Allowed>>(
      shape: string extends Allowed ? never : NoExtraKeys<R, Allowed>,
    ) {
      return _createFieldRegistry(shape)
    }
  },
  fromKeys<const A extends readonly [string, ...string[]]>(...keys: A) {
    // помечаем использование для eslint @typescript-eslint/no-unused-vars
    void keys
    return function <const R extends Shape<A[number]>>(shape: NoExtraKeys<R, A[number]>) {
      return _createFieldRegistry(shape)
    }
  },
})
