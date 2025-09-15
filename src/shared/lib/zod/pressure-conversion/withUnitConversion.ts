import { type ZodType, type ZodTypeDef } from 'zod'
import { getPressureConverter } from './get-pressure-converter'
import { withNumberConversion, type Range } from './number-conversion'
import type { PressureUnit } from './pressure'

export type UnitConversionOptions = Range & {
  from: PressureUnit
  to: PressureUnit
  round?: number
}

export function withUnitConversion<TDef extends ZodTypeDef, TIn>(
  schema: ZodType<number, TDef, TIn>,
  { from, to, min, max, round = 2 }: UnitConversionOptions,
) {
  const convert = getPressureConverter(from, to)
  return withNumberConversion(schema, convert, {
    round,
    range: { min, max },
    unit: to,
  })
}
