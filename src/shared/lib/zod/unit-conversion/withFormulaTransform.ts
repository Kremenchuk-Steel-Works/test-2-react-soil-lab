// withFormulaTransform.ts (исправленная версия)
import z, { type ZodTypeDef } from 'zod'
import type { Instrument } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withNumberConversion } from './number-conversion'
import type { TransformSpec } from './transform-types'

export type FormulaOptions<TArgs extends Record<string, number>> = Readonly<{
  transform: TransformSpec<TArgs>
  round?: number
  min?: number
  max?: number
  instrument?: Instrument
}>

type InputRecord = Record<string, unknown>
type ArgKey<TArgs> = keyof TArgs & string
type Keys<T> = Extract<keyof T, string>
type Missing<Need extends string, Have> = Exclude<Need, Keys<Have>>

// Полная и строгая мапа: каждый аргумент формулы должен указывать существующий ключ входной схемы
type StrictArgsMapping<TArgs extends Record<string, number>, TInput extends InputRecord> = {
  [K in ArgKey<TArgs>]-?: Extract<keyof TInput, string>
}

// Если каких-то ключей формулы нет во входе — args обязателен; иначе опционален
type ArgsRequirement<TInput extends InputRecord, TArgs extends Record<string, number>> =
  Missing<ArgKey<TArgs>, TInput> extends never
    ? { args?: StrictArgsMapping<TArgs, TInput> }
    : { args: StrictArgsMapping<TArgs, TInput> }

/**
 * Формульная трансформация (объект → число) + округление/диапазон/единица.
 * Важное: тип опций заставит передать args, если вход не покрывает все ключи формулы.
 */
export function withFormulaTransform<
  TSchema extends z.ZodType<InputRecord, ZodTypeDef, InputRecord>,
  TArgs extends Record<string, number>,
  TInput extends InputRecord = z.input<TSchema>,
>(
  inputs: TSchema,
  opts: FormulaOptions<TArgs> & ArgsRequirement<TInput, TArgs>,
): z.ZodType<number, ZodTypeDef, z.input<TSchema>> {
  const { transform, round = 2, min, max, instrument } = opts
  const mapping = (opts as { args?: StrictArgsMapping<TArgs, TInput> }).args

  if (!transform || !Array.isArray(transform.inputs) || typeof transform.compute !== 'function') {
    const who =
      typeof transform === 'object' && transform ? JSON.stringify(transform) : String(transform)
    throw new Error(`withFormulaTransform: invalid "transform". Got: ${who}.`)
  }

  const keys = transform.inputs as ReadonlyArray<keyof TArgs & string>

  // ВАЖНО: не кастим inputs к ZodType<InputRecord> — сохраняем точный вход z.input<TSchema>
  const base: z.ZodType<number, ZodTypeDef, z.input<TSchema>> = inputs
    .superRefine((values, ctx) => {
      // Делаем проверки наличия/числовости по каждому требуемому ключу
      for (const k of keys) {
        const srcKey = mapping?.[k] ?? k
        const raw = values[srcKey]
        if (raw === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [srcKey],
            message: `Поле "${srcKey}" обязательно для формулы "${transform.id}".`,
          })
          continue
        }
        const num = typeof raw === 'number' ? raw : Number(raw)
        if (!Number.isFinite(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [srcKey],
            message: `Поле "${srcKey}" должно быть числом.`,
          })
        }
      }
    })
    .transform((values) => {
      if (typeof values !== 'object' || values === null) return Number.NaN
      const dict = values

      const collected: Partial<Record<keyof TArgs & string, number>> = {}
      for (const k of keys) {
        const srcKey = mapping?.[k] ?? k
        const raw = dict[srcKey]
        const num = typeof raw === 'number' ? raw : Number(raw)
        if (!Number.isFinite(num)) return Number.NaN
        collected[k] = num
      }

      const args = collected as unknown as TArgs
      const res = transform.compute(args, { instrument })
      return Number.isFinite(res) ? res : Number.NaN
    })

  // Здесь тип входа сохранён: TIn = z.input<TSchema>, конфликт исчезает
  return withNumberConversion(base, (x) => x, {
    round,
    range: { min, max },
    unit: transform.unit,
  })
}
