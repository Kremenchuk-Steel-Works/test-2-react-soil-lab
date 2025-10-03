import type { Option } from '@/shared/ui/select/ReactSelect'

type StringKeyOf<D> = Extract<keyof D, string>

/**
 * Преобразует словарь вида Record<string,string> в массив опций для селекта.
 * @param dict Словарь { key: "Label" }
 * @param t Необязательная функция для локализации/трансформации лейбла
 * @returns Массив { value: key, label }
 * @example
 * dictToOptions({ a: "A" }) // [{ value: "a", label: "A" }]
 */
export function dictToOptions<const D extends Record<string, string>>(
  dict: D,
  t?: (id: D[StringKeyOf<D>]) => string,
): Option<StringKeyOf<D>>[] {
  const keys = Object.keys(dict) as Array<StringKeyOf<D>>
  return keys.map((k) => ({ value: k, label: t ? t(dict[k]) : dict[k] }))
}

/**
 * Достаёт человекочитаемый лейбл для значения по словарю.
 * @param dict Словарь { key: "Label" }
 * @param value Искомое значение (key), может быть string|number|unknown
 * @param opts.t Опциональная трансформация лейбла (например i18n)
 * @param opts.fallback Функция для fallback-строки, если ключ не найден
 * @returns Строка-лейбл
 */
export function labelFromDict<const D extends Record<string, string>>(
  dict: D,
  value: unknown,
  opts?: {
    t?: (id: D[StringKeyOf<D>]) => string
    fallback?: (v: unknown) => string
  },
): string {
  const key =
    typeof value === 'string' || typeof value === 'number'
      ? (String(value) as StringKeyOf<D>)
      : undefined

  if (key && key in dict) {
    const raw = dict[key]
    return opts?.t ? opts.t(raw) : raw
  }
  return opts?.fallback ? opts.fallback(value) : String(value)
}

/**
 * Удобный фасад вокруг словаря: готовые options, label() и isKey().
 * @param dict Словарь { key: "Label" }
 * @param t Необязательная трансформация лейблов
 * @returns { options, label, isKey }
 */
export function makeDict<const D extends Record<string, string>>(
  dict: D,
  t?: (id: D[StringKeyOf<D>]) => string,
) {
  type K = StringKeyOf<D>
  const options = dictToOptions(dict, t) // Option<K>[]

  const label = (value: unknown, fallback?: (v: unknown) => string): string =>
    labelFromDict(dict, value, { t, fallback })

  const isKey = (x: unknown): x is K => {
    if (typeof x === 'string') return x in dict
    if (typeof x === 'number') return String(x) in dict
    return false
  }

  return { options, label, isKey }
}

/**
 * Типобезопасный Object.keys: возвращает массив строковых ключей объекта.
 */
export const dictTypedKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as Array<Extract<keyof T, string>>

/**
 * Делает «зеркальный» словарь, где value = key (строго типизировано на уровне литералов).
 * Полезно для случаев вида { '13': '13', '14': '14', ... }.
 *
 * @param dict Базовый словарь (используются только ключи)
 * @returns Объект вида { [K in keyof D & string]: K }
 * @example
 * dictFromKeys({ '13': '13 (Наповнювальна)', '14': '14 (...)' })
 * // => { '13': '13', '14': '14' } с типом { '13': '13'; '14': '14' }
 */
export function dictFromKeys<const D extends Record<string, unknown>>(dict: D) {
  type K = Extract<keyof D, string>
  const keys = Object.keys(dict) as K[]
  return Object.fromEntries(keys.map((k) => [k, k])) as { [P in K]: P }
}

/**
 * Строит словарь, где value получается из исходной строки-лейбла по extractor.
 * По умолчанию отрезает хвост « (… )», т.е. '13 (Наповнювальна)' -> '13'.
 *
 * @param dict Словарь { key: "Label" }
 * @param extractor Кастомная логика извлечения «базового» значения из лейбла
 * @returns Record<K, string>
 * @example
 * dictFromValues({ '13': '13 (Наповнювальна)', '8': '8' })
 * // => { '13': '13', '8': '8' }
 */
export function dictFromValues<const D extends Record<string, string>>(
  dict: D,
  extractor: (label: D[StringKeyOf<D>]) => string = (s) => s.replace(/\s*\(.+\)$/, ''),
) {
  type K = StringKeyOf<D>
  const out = {} as Record<K, string>
  for (const k of Object.keys(dict) as K[]) {
    out[k] = extractor(dict[k])
  }
  return out
}
