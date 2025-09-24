import z, { type ZodType, type ZodTypeDef } from 'zod'
import {
  type Instrument,
  type RequireInstrumentPairs,
  type Unit,
} from '@/shared/lib/zod/unit-conversion/unit-types'
import { getUnitConverter } from './get-unit-converter'
import { withNumberConversion, type Range } from './number-conversion'

// Парные строковые литералы вида "from→to"
type Pair<F extends Unit, T extends Unit> = `${F}→${T}`

// Хелпер-предикат
type RequiresInstrument<F extends Unit, T extends Unit> =
  Pair<F, T> extends RequireInstrumentPairs ? true : false

// Базовые опции
type BaseOptions<F extends Unit, T extends Unit> = Range & {
  from: F
  to: T
  round?: number
}

// Итоговые опции: с обязательным или опциональным instrument
export type UnitConversionOptions<F extends Unit, T extends Unit> =
  RequiresInstrument<F, T> extends true
    ? BaseOptions<F, T> & { instrument: Instrument }
    : BaseOptions<F, T> & { instrument?: Instrument }

/** Оборачиваем Zod-схему числа -> возвращаем ZodType */
export function withUnitConversion<TDef extends ZodTypeDef, TIn, F extends Unit, T extends Unit>(
  schema: ZodType<number, TDef, TIn>,
  opts: UnitConversionOptions<F, T>,
): ZodType<number, ZodTypeDef, TIn>

// Конвертируем уже готовое число -> возвращаем number
export function withUnitConversion<F extends Unit, T extends Unit>(
  value: number,
  opts: UnitConversionOptions<F, T>,
): number

// === Реализация (общая) ===
export function withUnitConversion<TDef extends ZodTypeDef, TIn, F extends Unit, T extends Unit>(
  arg: ZodType<number, TDef, TIn> | number,
  opts: UnitConversionOptions<F, T>,
): ZodType<number, ZodTypeDef, TIn> | number {
  const { from, to, min, max, round = 2, instrument } = opts
  const convert = getUnitConverter(from, to, { instrument })

  // Пришло готовое число — конвертируем и валидируем через тот же пайп
  if (typeof arg === 'number') {
    const schema = withNumberConversion(z.number(), convert, {
      round,
      range: { min, max },
      unit: to,
    })
    // Возвращаем число (parse кинет ZodError если не прошло range/валидность)
    return schema.parse(arg)
  }

  // Пришла Zod-схема — возвращаем новую Zod-схему
  return withNumberConversion(arg, convert, {
    round,
    range: { min, max },
    unit: to,
  })
}
