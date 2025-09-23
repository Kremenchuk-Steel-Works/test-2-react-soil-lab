import type {
  ConverterFn,
  Instrument,
  Unit,
  UnitConversionConfig,
} from '@/shared/lib/zod/unit-conversion/unit-types'
import { ALL_CONVERSIONS } from './units'

export type UnitConverterOptions = {
  /** Прибор, для которого нужна специфичная формула (если есть) */
  instrument?: Instrument
}

function matchesInstrument(
  candidate: UnitConversionConfig['instrument'],
  target: Instrument,
): boolean {
  if (candidate === undefined) return false
  return Array.isArray(candidate) ? candidate.includes(target) : candidate === target
}

function listInstruments(cands: readonly UnitConversionConfig[]): Instrument[] {
  const acc: Instrument[] = []
  for (const c of cands) {
    const ins = c.instrument
    if (!ins) continue
    if (Array.isArray(ins)) {
      for (const i of ins) if (!acc.includes(i)) acc.push(i)
    } else {
      if (!acc.includes(ins)) acc.push(ins)
    }
  }
  return acc
}

export function getUnitConverter(
  from: Unit,
  to: Unit,
  opts: UnitConverterOptions = {},
): ConverterFn {
  if (from === to) return (x) => x

  const candidates = ALL_CONVERSIONS.filter((c) => c.from === from && c.to === to)
  if (candidates.length === 0) {
    throw new Error(`Нет формулы для ${from} → ${to}`)
  }

  const withInstrument = candidates.filter((c) => c.instrument !== undefined)
  const withoutInstrument = candidates.find((c) => c.instrument === undefined)

  // Если инструмент указан — требуется точное совпадение,
  // иначе, если приборных формул вообще нет, допускаем универсальную.
  if (opts.instrument) {
    const exact = candidates.find((c) => matchesInstrument(c.instrument, opts.instrument!))
    if (exact) return exact.formula

    if (withInstrument.length > 0) {
      const allowed = listInstruments(withInstrument).join(', ')
      throw new Error(
        `Для ${from} → ${to} есть приборные формулы (${allowed}), ` +
          `но прибор "${opts.instrument}" не поддерживается`,
      )
    }

    if (withoutInstrument) return withoutInstrument.formula

    // Теоретически недостижимо, но оставим безопасный fallback
    return candidates[0].formula
  }

  // Инструмент НЕ указан.
  // Если есть хотя бы одна приборная формула — требуем явный выбор прибора.
  if (withInstrument.length > 0) {
    const allowed = listInstruments(withInstrument).join(', ')
    throw new Error(`Для ${from} → ${to} требуется указать прибор (один из: ${allowed})`)
  }

  // Иначе — используем универсальную формулу (без привязки к прибору).
  if (withoutInstrument) return withoutInstrument.formula

  // Теоретически недостижимо (так как withInstrument уже проверили)
  return candidates[0].formula
}
