import z, { type ZodType, type ZodTypeDef } from 'zod'
import { getUnitConverter } from './get-unit-converter'
import { withNumberConversion, type Range } from './number-conversion'
import type { RequireInstrumentPairs } from './unit-derived-types'
import type { Instrument, Unit } from './unit-types'

// Парный литерал "from→to"
type Pair<F extends Unit, T extends Unit> = `${F}→${T}`

type RequiresInstrument<F extends Unit, T extends Unit> =
  Pair<F, T> extends RequireInstrumentPairs ? true : false

type BaseOptions<F extends Unit, T extends Unit> = Range & {
  from: F
  to: T
  round?: number
}

/** Если для пары есть хотя бы одна приборная формула:
 *  — instrument обязателен; иначе — запрещён (даст ошибку, если указать).
 */
export type UnitConversionOptions<F extends Unit, T extends Unit> =
  RequiresInstrument<F, T> extends true
    ? BaseOptions<F, T> & { instrument: Instrument }
    : BaseOptions<F, T> & { instrument?: never }

export function withUnitConversion<TDef extends ZodTypeDef, TIn, F extends Unit, T extends Unit>(
  schema: ZodType<number, TDef, TIn>,
  opts: UnitConversionOptions<F, T>,
): ZodType<number, ZodTypeDef, TIn>
export function withUnitConversion<F extends Unit, T extends Unit>(
  value: number,
  opts: UnitConversionOptions<F, T>,
): number

export function withUnitConversion<TDef extends ZodTypeDef, TIn, F extends Unit, T extends Unit>(
  arg: ZodType<number, TDef, TIn> | number,
  opts: UnitConversionOptions<F, T>,
): ZodType<number, ZodTypeDef, TIn> | number {
  const { from, to, min, max, round = 2 } = opts
  // Здесь TS уже гарантирует корректность opts.instrument (обязателен/запрещён)
  const convert = getUnitConverter(from, to, {
    instrument: (opts as { instrument?: Instrument }).instrument,
  })

  if (typeof arg === 'number') {
    const schema = withNumberConversion(z.number(), convert, {
      round,
      range: { min, max },
      unit: to,
    })
    return schema.parse(arg)
  }

  return withNumberConversion(arg, convert, {
    round,
    range: { min, max },
    unit: to,
  })
}
