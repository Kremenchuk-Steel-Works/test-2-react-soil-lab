import type { Option } from '@/shared/ui/select/ReactSelect'

type StringKeyOf<D> = Extract<keyof D, string>

export function dictToOptions<const D extends Record<string, string>>(
  dict: D,
  t?: (id: D[StringKeyOf<D>]) => string,
): Option<StringKeyOf<D>>[] {
  const keys = Object.keys(dict) as Array<StringKeyOf<D>>
  return keys.map((k) => ({ value: k, label: t ? t(dict[k]) : dict[k] }))
}

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
