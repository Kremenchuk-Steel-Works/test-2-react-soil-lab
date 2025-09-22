import { type ZodType, type ZodTypeDef } from 'zod'
import { getUnitConverter } from './get-unit-converter'
import { withNumberConversion, type Range } from './number-conversion'
import type { Unit } from './units'

export type UnitConversionOptions = Range & {
  from: Unit
  to: Unit
  round?: number
}

/** Единый враппер для любых поддерживаемых единиц */
export function withUnitConversion<TDef extends ZodTypeDef, TIn>(
  schema: ZodType<number, TDef, TIn>,
  { from, to, min, max, round = 2 }: UnitConversionOptions,
) {
  const convert = getUnitConverter(from, to)
  return withNumberConversion(schema, convert, {
    round,
    range: { min, max },
    unit: to,
  })
}
