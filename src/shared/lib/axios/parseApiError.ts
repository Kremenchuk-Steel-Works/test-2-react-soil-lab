import { isAxiosError } from 'axios'

export type ApiErrorPayload = {
  detail?:
    | string
    | Array<{
        type?: string
        loc?: Array<string | number>
        msg?: string
        input?: unknown
        ctx?: Record<string, unknown>
      }>
  message?: string
  errors?: Record<string, string | string[]> | Array<{ field?: string; message?: string }>
}

export type ParsedApiIssueKind = 'missing' | 'extra' | 'value' | 'unknown'

export type ParsedApiIssue = {
  /** как прислал бек (обычно snake_case из loc) */
  fieldRaw?: string
  /** нормализованное имя поля (camelCase, если смогли определить) */
  field?: string
  /** тип проблемы */
  kind: ParsedApiIssueKind
  /** человекочитаемое сообщение */
  message: string
}

export type ParsedApiError = {
  status?: number
  /** общий текст, если issues пуст */
  message: string
  issues: ParsedApiIssue[]
}

const toStr = (v: unknown): string => {
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return v.map(toStr).filter(Boolean).join('; ')
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (typeof o.msg === 'string') return o.msg
    if (typeof o.message === 'string') return o.message
    try {
      return JSON.stringify(v)
    } catch {
      return 'Server error'
    }
  }
  return 'Server error'
}

const snakeToCamel = (s: string): string =>
  s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())

const locToFieldRaw = (loc?: Array<string | number>): string | undefined => {
  if (!Array.isArray(loc) || loc.length === 0) return undefined
  const parts = loc.filter((p) => p !== 'body')
  if (parts.length === 0) return undefined
  // loc уже snake_case — собираем в путь a.b[0].c. Для простых полей это просто имя.
  let out = ''
  for (const p of parts) {
    if (typeof p === 'number') out += `[${p}]`
    else out += out ? `.${p}` : p
  }
  return out
}

export function parseApiError(err: unknown): ParsedApiError {
  if (!isAxiosError<ApiErrorPayload>(err)) {
    return { message: err instanceof Error ? err.message : 'Unknown error', issues: [] }
  }

  const status = err.response?.status
  const data = err.response?.data
  const fallbackMessage =
    (typeof data?.detail === 'string' ? data.detail : undefined) ??
    data?.message ??
    err.message ??
    'Server error'

  const issues: ParsedApiIssue[] = []

  // Errors как объект
  if (data?.errors && !Array.isArray(data.errors)) {
    for (const [fieldRaw, raw] of Object.entries(data.errors)) {
      issues.push({
        fieldRaw,
        field: snakeToCamel(fieldRaw),
        kind: 'value',
        message: toStr(raw),
      })
    }
  }

  // Errors как массив
  if (Array.isArray(data?.errors)) {
    for (const it of data.errors) {
      if (!it) continue
      const fieldRaw = typeof it.field === 'string' ? it.field : undefined
      issues.push({
        fieldRaw,
        field: fieldRaw ? snakeToCamel(fieldRaw) : undefined,
        kind: 'value',
        message: toStr(it.message),
      })
    }
  }

  // Pydantic v2: detail[]
  if (Array.isArray(data?.detail)) {
    for (const d of data.detail) {
      if (!d) continue
      const type = (d as { type?: string }).type ?? 'unknown'
      const fieldRaw = locToFieldRaw((d as { loc?: Array<string | number> }).loc)
      const msg = toStr((d as { msg?: unknown }).msg)
      const kind: ParsedApiIssueKind =
        type === 'missing' ? 'missing' : type === 'extra_forbidden' ? 'extra' : 'value'
      issues.push({
        fieldRaw,
        field: fieldRaw ? snakeToCamel(fieldRaw) : undefined,
        kind,
        message: msg,
      })
    }
  }

  // detail как строка
  if (typeof data?.detail === 'string' && issues.length === 0) {
    issues.push({ kind: 'unknown', message: data.detail })
  }

  return { status, message: toStr(fallbackMessage), issues }
}
