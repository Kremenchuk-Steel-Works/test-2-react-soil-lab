import { type ZodType, type ZodTypeDef } from 'zod'
import { withNumberConversion, type Range } from './number-conversion'

const N_PER_KGF = 9.80665

export function withNcm2ToKgfcm2Conversion<TDef extends ZodTypeDef, TIn>(
  schema: ZodType<number, TDef, TIn>,
  options: Range & { round?: number } = {},
) {
  const { min, max, round = 2 } = options
  return withNumberConversion(schema, (value) => value / N_PER_KGF, {
    round,
    range: { min, max },
    unit: 'кгс/см²',
  })
}
