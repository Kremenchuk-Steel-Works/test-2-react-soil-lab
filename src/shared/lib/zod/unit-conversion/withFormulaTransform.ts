import z, { type ZodTypeDef } from 'zod'
import type { Instrument } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withNumberConversion } from './number-conversion'
import type { TransformSpec } from './transform-types'

export type FormulaOptions<TArgs extends Record<string, number>> = Readonly<{
  transform: TransformSpec<TArgs>
  args?: Partial<Record<keyof TArgs & string, string>>
  round?: number
  min?: number
  max?: number
  instrument?: Instrument
}>

/**
 * Формульная трансформация (объект → число) + округление/диапазон/единица.
 */
export function withFormulaTransform<
  TSchema extends z.ZodType<unknown, ZodTypeDef, unknown>,
  TArgs extends Record<string, number>,
>(inputs: TSchema, opts: FormulaOptions<TArgs>): z.ZodType<number, ZodTypeDef, z.input<TSchema>> {
  const { transform, args: mapping, round = 2, min, max, instrument } = opts

  if (!transform || !Array.isArray(transform.inputs) || typeof transform.compute !== 'function') {
    const who =
      typeof transform === 'object' && transform ? JSON.stringify(transform) : String(transform)
    throw new Error(`withFormulaTransform: invalid "transform". Got: ${who}.`)
  }

  const keys = transform.inputs as ReadonlyArray<keyof TArgs & string>

  const base = inputs.transform((values: unknown) => {
    if (typeof values !== 'object' || values === null) return Number.NaN
    const dict = values as Record<string, unknown>

    const collected: Partial<Record<keyof TArgs & string, number>> = {}
    for (const k of keys) {
      const srcKey = (mapping && k in mapping ? mapping[k] : k) as string
      const raw = dict[srcKey]
      const num = typeof raw === 'number' ? raw : Number(raw)
      if (!Number.isFinite(num)) return Number.NaN
      collected[k] = num
    }

    const args = collected as unknown as TArgs
    const res = transform.compute(args, { instrument })
    return Number.isFinite(res) ? res : Number.NaN
  })

  return withNumberConversion(base, (x) => x, {
    round,
    range: { min, max },
    unit: transform.unit,
  })
}
