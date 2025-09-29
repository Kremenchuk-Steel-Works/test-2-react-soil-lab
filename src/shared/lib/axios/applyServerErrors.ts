import axios from 'axios'
import type {
  FieldPath,
  FieldValues,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetFocus,
} from 'react-hook-form'
import { API_URL } from '@/shared/config/env'
import {
  parseApiError,
  type ParsedApiError,
  type ParsedApiIssue,
} from '@/shared/lib/axios/parseApiError'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5_000,
})

function collectFieldPaths(obj: unknown, base = ''): string[] {
  const paths: string[] = []
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      const p = `${base}[${i}]`
      paths.push(p, ...collectFieldPaths(v, p))
    })
    return paths
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const p = base ? `${base}.${k}` : k
      paths.push(p, ...collectFieldPaths(v, p))
    }
    return paths
  }
  return paths
}

export type ApplyServerErrorsOptions<TValues extends FieldValues> = {
  err: unknown
  knownFields?: readonly FieldPath<TValues>[]
  getValues?: UseFormGetValues<TValues>
  setError: UseFormSetError<TValues>
  setFocus?: UseFormSetFocus<TValues>
  messages?: { missing?: string; extra?: string }
  summary?: { delimiter?: string; includeKnownExtra?: boolean; noUnknownLabelPrefix?: boolean }
  overrides?: Array<(parsed: ParsedApiError) => boolean | void>
  mapFallbackField?: (parsed: ParsedApiError) => FieldPath<TValues> | undefined
  /** Если true — missing не перетирается extra на том же поле в рамках одного ответа */
  preferMissingOverExtra?: boolean
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
    messages,
    summary,
    overrides,
    mapFallbackField,
    preferMissingOverExtra = true,
  } = opts

  const parsed = parseApiError(err)
  if (overrides) {
    for (const rule of overrides) {
      if (rule(parsed)) return
    }
  }

  // Какие имена считаем валидными для setError на поля формы
  let allowed: Set<string>
  if (knownFields?.length) {
    allowed = new Set<string>(knownFields.map(String))
  } else if (getValues) {
    allowed = new Set<string>(collectFieldPaths(getValues()))
  } else {
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

  // Копим сообщения по полям с приоритетом (missing > extra > other)
  type Priority = 0 | 1 | 2
  const priorityOf = (k: ParsedApiIssue['kind']): Priority =>
    k === 'missing' ? 2 : k === 'extra' ? 1 : 0
  const perField = new Map<FieldPath<TValues>, { p: Priority; msg: string }>()

  let focused = false
  const addRoot = (kind: ParsedApiIssue['kind'], label: string) => {
    if (kind === 'missing') missingUnknown.push(label)
    else if (kind === 'extra') extraUnknown.push(label)
    else otherRoot.push(label)
  }

  for (const issue of parsed.issues) {
    // Если парсер дал "field" (мэппинг к имени формы) и/или "fieldRaw" (исходное API-имя)
    const field = issue.field ?? ''
    const fieldRaw = issue.fieldRaw ?? ''

    const isKnownFormField = field && allowed.has(field)
    const isRawKnownInForm = fieldRaw && allowed.has(fieldRaw)

    // Особый случай: сервер говорит "missing measurement_1", а форма знает только "measurement1".
    // Тогда: показываем missing по корню как неизвестное (именно measurement_1),
    // но на поле measurement1 НЕ перезаписываем missing ошибку extra'ой ниже.
    if (issue.kind === 'missing' && !isRawKnownInForm && isKnownFormField) {
      // в root — сырой ключ API, чтобы пользователь видел "measurement_1 - не вказано"
      const human = 'не вказано'
      if (!fieldRaw && noUnknownLabelPrefix) {
        otherRoot.push(human)
      } else {
        addRoot('missing', `${fieldRaw || 'Невідоме поле'} - ${human}`)
      }
      // Дополнительно можно подсветить само поле (опционально). Если не хочешь — закомментируй.
      const p = priorityOf('missing')
      if (
        !perField.has(field as FieldPath<TValues>) ||
        p > perField.get(field as FieldPath<TValues>)!.p
      ) {
        perField.set(field as FieldPath<TValues>, { p, msg: msgMissing })
      }
      continue
    }

    if (isKnownFormField) {
      const human =
        issue.kind === 'missing' ? msgMissing : issue.kind === 'extra' ? msgExtra : issue.message
      const p = priorityOf(issue.kind)

      const prev = perField.get(field as FieldPath<TValues>)
      const shouldReplace = !prev || (preferMissingOverExtra ? p > prev.p : true)
      if (shouldReplace) {
        perField.set(field as FieldPath<TValues>, { p, msg: human })
      }

      if (!focused && setFocus) {
        setFocus(field as FieldPath<TValues>, { shouldSelect: true })
        focused = true
      }
      if (issue.kind === 'extra' && summary?.includeKnownExtra) {
        extraKnown.push(String(field))
      }
    } else {
      // Поле для формы неизвестно -> в root
      const label = field || fieldRaw
      const human =
        issue.kind === 'missing'
          ? 'не вказано'
          : issue.kind === 'extra'
            ? 'зайве'
            : issue.message || 'помилка'

      if (!label && noUnknownLabelPrefix) {
        otherRoot.push(human)
      } else {
        addRoot(issue.kind, `${label ?? 'Невідоме поле'} - ${human}`)
      }
    }
  }

  // Выставляем ошибки на поля с учётом приоритета
  for (const [name, { msg }] of perField.entries()) {
    setError(name, { type: 'server', message: msg })
  }

  // Fallback: только message без issues
  if (!parsed.issues.length && parsed.message) {
    const fallbackField = mapFallbackField?.(parsed)
    if (fallbackField) {
      setError(fallbackField, { type: 'server', message: parsed.message })
      if (!focused && setFocus) setFocus(fallbackField, { shouldSelect: true })
    } else {
      otherRoot.push(parsed.message)
    }
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
