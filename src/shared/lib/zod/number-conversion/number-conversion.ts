import { z, type ZodType, type ZodTypeDef } from 'zod'

export type Range = { min?: number; max?: number }

export type ConversionOptions = {
  round?: number
  range?: Range
  unit?: string
  makeMessage?: (rounded: number, range: Range, unit?: string) => string
}

/**
 * Универсальный конвертер: number -> convert -> round -> validate(range)
 * Возвращаем обобщённый ZodType, чтобы не конфликтовать с вложенными ZodEffects.
 */
export function withNumberConversion<TDef extends ZodTypeDef, TIn>(
  schema: ZodType<number, TDef, TIn>,
  convert: (input: number) => number,
  opts: ConversionOptions = {},
): z.ZodType<number, z.ZodTypeDef, TIn> {
  const { round = 2, range = {}, unit } = opts

  const rounder = (v: number): number => {
    const p = 10 ** round
    const r = Math.round(v * p) / p
    return Object.is(r, -0) ? 0 : r
  }

  const fmt = (n: number) => n.toFixed(round)
  const u = unit ? ` ${unit}` : ''

  return schema
    .refine((v) => Number.isFinite(v), { message: 'Некоректне число' })
    .transform((v) => rounder(convert(v)))
    .superRefine((rounded, ctx) => {
      if (!Number.isFinite(rounded)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Некоректне число' })
        return
      }

      const { min, max } = range

      if (min !== undefined && rounded < min) {
        const message =
          opts.makeMessage?.(rounded, range, unit) ??
          `Результат повинен бути більше або дорівнювати ${fmt(min)}${u}. Поточне: ${fmt(rounded)}${u}`
        ctx.addIssue({ code: z.ZodIssueCode.custom, message })
        return
      }

      if (max !== undefined && rounded > max) {
        const message =
          opts.makeMessage?.(rounded, range, unit) ??
          `Результат повинен бути менше або дорівнювати ${fmt(max)}${u}. Поточне: ${fmt(rounded)}${u}`
        ctx.addIssue({ code: z.ZodIssueCode.custom, message })
      }
    })
}
