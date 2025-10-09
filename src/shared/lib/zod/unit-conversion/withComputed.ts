import z, { type ZodType, type ZodTypeDef } from 'zod'
import { withNumberConversion, type ConversionOptions } from './number-conversion'

/**
 * inputs: любая Zod-схема (объект, массив, кортеж и т.д.)
 * compute: как из output(inputs) получить число
 * На выходе: ZodType<number> с сохранением входного типа inputs.
 */
export function withComputed<TSchema extends z.ZodTypeAny>(
  inputs: TSchema,
  compute: (values: z.output<TSchema>) => number,
  opts: ConversionOptions = {},
): ZodType<number, ZodTypeDef, z.input<TSchema>> {
  // Превращаем inputs -> number, НЕ теряя входной тип (TIn) схемы
  const base = inputs.transform((v) => {
    const n = compute(v as z.output<TSchema>)
    return Number.isFinite(n) ? n : Number.NaN
  })

  return withNumberConversion(base, (x) => x, opts)
}
