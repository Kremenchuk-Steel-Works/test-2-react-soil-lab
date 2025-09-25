import { isValidElement, type ReactNode } from 'react'

export type ValueFormatter<T> = {
  render: (value: T | null | undefined) => ReactNode
  toText: (value: T | null | undefined) => string
  placeholder?: ReactNode
}

function isStr(x: unknown): x is string {
  return typeof x === 'string'
}
function isNum(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x)
}
function isBig(x: unknown): x is bigint {
  return typeof x === 'bigint'
}
function isBool(x: unknown): x is boolean {
  return typeof x === 'boolean'
}

export const vf = {
  display<T>(opts?: {
    placeholder?: ReactNode
    format?: (v: T) => ReactNode
    toText?: (v: T) => string
  }): ValueFormatter<T> {
    const placeholder = opts?.placeholder ?? '—'
    return {
      render: (v) => {
        if (v === null || v === undefined || v === '') return placeholder
        if (opts?.format) return opts.format(v as T)
        if (isStr(v) || isNum(v) || isBig(v)) return v as unknown as ReactNode
        if (isBool(v)) return v ? 'true' : 'false'
        if (v instanceof Date) return v.toISOString()
        if (isValidElement(v)) return v
        if (Array.isArray(v)) return v as unknown as ReactNode
        return placeholder
      },
      toText: (v) => {
        if (v === null || v === undefined || v === '') return ''
        if (opts?.toText) return opts.toText(v as T)
        if (isStr(v)) return v
        if (isNum(v) || isBig(v)) return String(v)
        if (isBool(v)) return v ? 'true' : 'false'
        if (v instanceof Date) return v.toISOString()
        return ''
      },
      placeholder,
    }
  },

  date(opts?: {
    placeholder?: string
    formatter?: (d: Date) => string
  }): ValueFormatter<string | Date> {
    const placeholder = opts?.placeholder ?? '—'
    const fmt = opts?.formatter ?? ((d: Date) => d.toLocaleString())
    const toDate = (v: string | Date | null | undefined): Date | null => {
      if (v == null || v === '') return null
      if (v instanceof Date) return v
      const d = new Date(v)
      return Number.isNaN(d.getTime()) ? null : d
    }
    return {
      render: (v) => {
        const d = toDate(v)
        return d ? fmt(d) : placeholder
      },
      toText: (v) => {
        const d = toDate(v)
        return d ? fmt(d) : ''
      },
      placeholder,
    }
  },

  option<T>(
    options: ReadonlyArray<{ value: T; label: string }>,
    defaultLabel = '-',
  ): ValueFormatter<T> {
    const map = new Map<T, string>(options.map((o) => [o.value, o.label]))
    return {
      render: (v) => (v == null ? defaultLabel : (map.get(v) ?? defaultLabel)),
      toText: (v) => (v == null ? '' : (map.get(v) ?? defaultLabel)),
      placeholder: defaultLabel,
    }
  },

  list<T>(itemFmt: ValueFormatter<T>, separator = ', '): ValueFormatter<ReadonlyArray<T>> {
    return {
      render: (list) => {
        if (!list || list.length === 0) return itemFmt.placeholder ?? '—'
        const out: ReactNode[] = []
        list.forEach((it, i) => {
          if (i > 0) out.push(separator)
          out.push(itemFmt.render(it))
        })
        return out
      },
      toText: (list) =>
        !list || list.length === 0 ? '' : list.map(itemFmt.toText).join(separator),
      placeholder: itemFmt.placeholder ?? '—',
    }
  },
} as const
