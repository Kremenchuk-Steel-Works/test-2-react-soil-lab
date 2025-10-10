import type { ConverterFn, Instrument, Unit, UnitConversionConfig } from './unit-types'
import { ALL_CONVERSIONS } from './units'

/** Опции подбора конвертера */
export type UnitConverterOptions = Readonly<{
  /** Прибор, для которого нужна специфичная формула (если есть) */
  instrument?: Instrument
}>

/** Внутреннее представление набора формул для пары from→to */
type Bucket = Readonly<{
  /** Формула без привязки к прибору (может отсутствовать) */
  universal?: UnitConversionConfig
  /** Набор «приборных» формул (может быть пустым) */
  instrumented: ReadonlyArray<UnitConversionConfig>
}>

/** Ключ пары from→to */
function pairKey(from: Unit, to: Unit): string {
  return `${from}→${to}`
}

/** ❗Разрешённое расширение: приводим литеральный кортеж к общему виду */
const CONVERSIONS: readonly UnitConversionConfig[] =
  ALL_CONVERSIONS as readonly UnitConversionConfig[]

/** Индексируем все формулы по паре единиц (один раз при загрузке модуля) */
const INDEX: ReadonlyMap<string, Bucket> = (() => {
  const map = new Map<
    string,
    { universal?: UnitConversionConfig; instrumented: UnitConversionConfig[] }
  >()

  for (const cfg of CONVERSIONS) {
    const k = pairKey(cfg.from, cfg.to)
    const bucket = map.get(k) ?? { universal: undefined, instrumented: [] }

    if (cfg.instrument === undefined) {
      // Храним одну «универсальную» формулу (первая победила)
      if (!bucket.universal) bucket.universal = cfg
    } else {
      bucket.instrumented.push(cfg)
    }

    map.set(k, bucket)
  }

  // Замораживаем/нормализуем к Readonly
  const readonly = new Map<string, Bucket>()
  for (const [k, b] of map) {
    readonly.set(k, { universal: b.universal, instrumented: b.instrumented.slice() })
  }
  return readonly
})()

/** Уникальный список приборов, доступных в «приборных» формулах корзины */
function listInstrumentsOf(bucket: Bucket): readonly Instrument[] {
  const set = new Set<Instrument>()
  for (const c of bucket.instrumented) {
    const ins = c.instrument! // здесь точно есть (ветка instrumented)
    if (Array.isArray(ins)) ins.forEach((i) => set.add(i))
    else set.add(ins)
  }
  return [...set]
}

/** Поиск «приборной» формулы под конкретный прибор */
function findInstrumented(
  bucket: Bucket,
  instrument: Instrument,
): UnitConversionConfig | undefined {
  for (const c of bucket.instrumented) {
    const ins = c.instrument!
    if (Array.isArray(ins) ? ins.includes(instrument) : ins === instrument) return c
  }
  return undefined
}

/**
 * Подбирает функцию-конвертер для пары единиц `from → to` с учётом прибора.
 *
 * Правила:
 * - Если `from === to` — возвращается тождественная функция.
 * - Если указан `instrument` — ищется точное совпадение по прибору;
 *   при отсутствии совпадения и наличии «приборных» формул — ошибка с перечислением доступных приборов.
 *   если «приборных» нет — берём универсальную формулу (если есть).
 * - Если `instrument` НЕ указан:
 *   — если есть хотя бы одна «приборная» формула — ошибка «требуется указать прибор»;
 *   — иначе берём универсальную формулу.
 *
 * Бросает ошибку, если подходящей формулы нет.
 */
export function getUnitConverter(
  from: Unit,
  to: Unit,
  opts: UnitConverterOptions = {},
): ConverterFn {
  if (from === to) return (x) => x

  const bucket = INDEX.get(pairKey(from, to))
  if (!bucket) {
    throw new Error(`Нет формулы для ${from} → ${to}`)
  }

  const { instrument } = opts

  if (instrument) {
    const exact = findInstrumented(bucket, instrument)
    if (exact) return exact.formula

    if (bucket.instrumented.length > 0) {
      const allowed = listInstrumentsOf(bucket).join(', ')
      throw new Error(
        `Для ${from} → ${to} есть приборные формулы (${allowed}), ` +
          `но прибор "${instrument}" не поддерживается`,
      )
    }

    // Прибор указан, но «приборных» формул нет — используем универсальную, если она есть
    if (bucket.universal) return bucket.universal.formula

    throw new Error(`Нет подходящей формулы для ${from} → ${to}`)
  }

  // Инструмент НЕ указан
  if (bucket.instrumented.length > 0) {
    const allowed = listInstrumentsOf(bucket).join(', ')
    throw new Error(`Для ${from} → ${to} требуется указать прибор (один из: ${allowed})`)
  }

  if (bucket.universal) return bucket.universal.formula

  throw new Error(`Нет подходящей формулы для ${from} → ${to}`)
}
