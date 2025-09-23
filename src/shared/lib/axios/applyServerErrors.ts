import type {
  FieldPath,
  FieldValues,
  FormState,
  UseFormGetFieldState,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetFocus,
} from 'react-hook-form'
import {
  parseApiError,
  type ParsedApiError,
  type ParsedApiIssue,
} from '@/shared/lib/axios/parseApiError'

/** Безопасное приведение к строке — дружит с restrict-template-expressions */
function toStringSafe(v: unknown): string {
  if (typeof v === 'string') return v
  if (v == null) return ''
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return v.map(toStringSafe).filter(Boolean).join('; ')
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (typeof o.message === 'string') return o.message
    if (typeof o.msg === 'string') return o.msg
    try {
      return JSON.stringify(o)
    } catch {
      return ''
    }
  }
  return ''
}

/** Собираем пути значений: a.b[0].c (совместимо с RHF) */
function collectFieldPaths(obj: unknown, base = ''): string[] {
  const paths: string[] = []
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      const p = `${base}[${i}]`
      paths.push(p)
      paths.push(...collectFieldPaths(v, p))
    })
    return paths
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const p = base ? `${base}.${k}` : k
      paths.push(p)
      paths.push(...collectFieldPaths(v, p))
    }
    return paths
  }
  return paths
}

export type ApplyServerErrorsOptions<TValues extends FieldValues> = {
  err: unknown
  /** Если не передан — возьмём все пути из getValues() */
  knownFields?: readonly FieldPath<TValues>[]
  /** Дай из useFormContext — и мы сами соберём knownFields при необходимости */
  getValues?: UseFormGetValues<TValues>
  setError?: UseFormSetError<TValues>
  setFocus?: UseFormSetFocus<TValues>
  getFieldState?: UseFormGetFieldState<TValues>
  formState?: FormState<TValues>
  messages?: {
    missing?: string
    extra?: string
  }
  summary?: {
    delimiter?: string
    includeKnownExtra?: boolean
    noUnknownLabelPrefix?: boolean
  }
  overrides?: Array<(parsed: ParsedApiError) => boolean | void>
  mapFallbackField?: (parsed: ParsedApiError) => FieldPath<TValues> | undefined
}

export function applyServerErrors<TValues extends FieldValues>(
  opts: ApplyServerErrorsOptions<TValues>,
): void {
  const {
    err,
    knownFields,
    getValues,
    setError,
    setFocus,
    getFieldState,
    formState,
    messages,
    summary,
    overrides,
    mapFallbackField,
  } = opts

  if (!setError) {
    throw new Error('applyServerErrors: setError is required')
  }

  const parsed = parseApiError(err)

  if (overrides) {
    for (const rule of overrides) {
      const stop = rule(parsed)
      if (stop) return
    }
  }

  // 1) Определяем разрешённые имена полей
  let allowed: Set<string>
  if (knownFields && knownFields.length) {
    allowed = new Set<string>(knownFields.map(String))
  } else if (getValues) {
    const all = getValues()
    allowed = new Set<string>(collectFieldPaths(all))
  } else {
    // last resort: считаем известными те, что пришли в ошибках
    allowed = new Set<string>(parsed.issues.map((i) => i.field).filter(Boolean) as string[])
  }

  const msgMissing = messages?.missing ?? `Обов'язкове поле`
  const msgExtra = messages?.extra ?? 'Це поле не приймається сервером для цього запиту'
  const delim = summary?.delimiter ?? ' • '
  const noUnknownLabelPrefix = summary?.noUnknownLabelPrefix ?? true

  const missingUnknown: string[] = []
  const extraUnknown: string[] = []
  const extraKnown: string[] = summary?.includeKnownExtra ? [] : []
  const otherRoot: string[] = []
  let focused = false

  const addRoot = (kind: ParsedApiIssue['kind'], label: string) => {
    if (kind === 'missing') missingUnknown.push(label)
    else if (kind === 'extra') extraUnknown.push(label)
    else otherRoot.push(label)
  }

  for (const issue of parsed.issues) {
    const name =
      issue.field && allowed.has(issue.field) ? (issue.field as FieldPath<TValues>) : undefined

    if (name) {
      const human =
        issue.kind === 'missing' ? msgMissing : issue.kind === 'extra' ? msgExtra : issue.message

      if (getFieldState && formState) {
        const { error } = getFieldState(name, formState)
        const existing = toStringSafe(error?.message)
        const combined = existing ? `${existing}; ${human}` : human
        setError(name, { type: 'server', message: combined })
      } else {
        setError(name, { type: 'server', message: human })
      }

      if (!focused && setFocus) {
        setFocus(name, { shouldSelect: true })
        focused = true
      }
      if (issue.kind === 'extra' && summary?.includeKnownExtra) {
        extraKnown.push(String(name))
      }
    } else {
      const label = issue.field ?? issue.fieldRaw
      const human =
        issue.kind === 'missing'
          ? 'не вказано'
          : issue.kind === 'extra'
            ? 'зайве'
            : issue.message || 'помилка'

      if (!label && noUnknownLabelPrefix) {
        otherRoot.push(human) // общий detail без префикса
      } else {
        addRoot(issue.kind, `${label ?? 'Невідоме поле'} - ${human}`)
      }
    }
  }

  if (parsed.issues.length === 0 && parsed.message) {
    const fallbackField = mapFallbackField?.(parsed)
    if (fallbackField) {
      setError(fallbackField, { type: 'server', message: parsed.message })
      if (!focused && setFocus) setFocus(fallbackField, { shouldSelect: true })
      return
    }
    otherRoot.push(parsed.message)
  }

  const lines: string[] = []
  if (missingUnknown.length)
    lines.push(`Не вистачає полів: ${Array.from(new Set(missingUnknown)).join(', ')}`)
  if (summary?.includeKnownExtra && extraKnown.length)
    lines.push(`Зайві поля (відомі у формі): ${Array.from(new Set(extraKnown)).join(', ')}`)
  if (extraUnknown.length)
    lines.push(`Зайві поля (невідомі): ${Array.from(new Set(extraUnknown)).join(', ')}`)
  if (otherRoot.length) lines.push(Array.from(new Set(otherRoot)).join('; '))

  if (lines.length) {
    setError('root' as unknown as FieldPath<TValues>, {
      type: 'server',
      message: lines.join(delim),
    })
  }
}
