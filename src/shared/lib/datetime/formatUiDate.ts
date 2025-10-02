export type UiDateMode = 'auto' | 'date' | 'time' | 'datetime'

export interface FormatUiOptions {
  /** Принудительный режим. Если не задан — авто по входу. */
  mode?: UiDateMode
  /** Локаль; по умолчанию — локаль пользователя. */
  locale?: string | string[]
  /**
   * Принудительный часовой пояс (например, 'Europe/Kyiv').
   * Если не задан — используется TZ пользователя.
   */
  timeZone?: string
  /**
   * Дополнительные опции Intl.DateTimeFormat (если хочешь настроить стиль).
   * По умолчанию не задаём styles, чтобы совпадать с .toLocale*String().
   */
  intlOptions?: Intl.DateTimeFormatOptions
  /**
   * Как вести себя с "плоскими" значениями (date-only/time-only), когда timeZone НЕ задан:
   *  - 'preserve' (дефолт): не конвертировать, исключить смещения (надёжно для календарных дат/«настенных» времён).
   *  - 'convert': вести себя как с datetime — конвертировать в TZ пользователя.
   */
  plainPolicy?: 'preserve' | 'convert'
}

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_ONLY_RE = /^\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/
const HAS_TZ_RE = /(Z|[+-]\d{2}:\d{2})$/

type DetectedKind = 'date' | 'time' | 'datetime'

function detectKind(input: string | number | Date): DetectedKind {
  if (input instanceof Date || typeof input === 'number') return 'datetime'
  const s = input.trim()
  if (TIME_ONLY_RE.test(s)) return 'time'
  if (DATE_ONLY_RE.test(s)) return 'date'
  return 'datetime'
}

function ensureIsoWithTz(s: string): string {
  const norm = s.trim().replace(' ', 'T')
  return HAS_TZ_RE.test(norm) ? norm : `${norm}Z` // считаем UTC, если TZ не указан
}

function toDateForKind(value: string | number | Date, kind: DetectedKind): Date {
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value) // epoch ms
  const s = value.trim()

  if (kind === 'date' && DATE_ONLY_RE.test(s)) {
    const [y, m, d] = s.split('-').map(Number)
    // Создаём полуночь UTC, чтобы потом можно было безопасно отрендерить календарный день.
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0))
  }

  if (kind === 'time' && TIME_ONLY_RE.test(s)) {
    const [h, m, rest] = s.split(':')
    const [sec = '0', ms = '0'] = (rest ?? '').split('.')
    return new Date(Date.UTC(1970, 0, 1, Number(h), Number(m), Number(sec), Number(ms)))
  }

  // datetime-строки: если TZ отсутствует — трактуем как UTC
  return new Date(ensureIsoWithTz(s))
}

/**
 * Универсальный форматтер для UI.
 * По умолчанию:
 *   - datetime → конвертация в локальную TZ пользователя (как .toLocaleString()).
 *   - date/time (plain) → без сдвигов (preserve), чтобы не "уплывали".
 */
export function formatUiDate(value: string | number | Date, options: FormatUiOptions = {}): string {
  const detected = detectKind(value)
  const mode: Exclude<UiDateMode, 'auto'> =
    options.mode && options.mode !== 'auto' ? options.mode : detected

  const date = toDateForKind(value, detected)

  const { locale, timeZone, intlOptions, plainPolicy = 'preserve' } = options

  // База опций: если задан timeZone — используем его; иначе — TZ пользователя (undefined).
  const base = (extra?: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => ({
    ...(timeZone ? { timeZone } : {}),
    ...(extra ?? {}),
    ...(intlOptions ?? {}),
  })

  // Для "плоских" значений при policy='preserve' и отсутствии принудительного timeZone
  // рендерим с timeZone: 'UTC', чтобы исключить TZ-конверсию.
  const plainSafe = !timeZone && plainPolicy === 'preserve' ? { timeZone: 'UTC' as const } : {}

  switch (mode) {
    case 'date':
      return date.toLocaleDateString(locale, base(plainSafe))
    case 'time':
      return date.toLocaleTimeString(locale, base(plainSafe))
    case 'datetime':
    default:
      // Как new Date(...).toLocaleString(): TZ пользователя, если timeZone не передали.
      return date.toLocaleString(locale, base())
  }
}
