import z, { type ZodTypeDef } from 'zod'
import type { Instrument } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withNumberConversion } from './number-conversion'
import type { TransformSpec } from './transform-types'

/** Опции формульного преобразования. */
export type FormulaOptions<TArgs extends Record<string, number>> = Readonly<{
  transform: TransformSpec<TArgs>
  round?: number
  min?: number
  max?: number
  instrument?: Instrument
}>

/** Входные данные для поля (произвольный объект). */
type InputRecord = Record<string, unknown>

/** Строковые ключи аргументов формулы. */
type ArgKey<TArgs> = keyof TArgs & string

/** Удобный тип для извлечения строковых ключей. */
type Keys<T> = Extract<keyof T, string>

/**
 * Строгая мапа: каждый ключ аргумента формулы -> существующий ключ входного объекта.
 * Используется, если нужно переименовать ключи: { аргументВФормуле: 'ключВоВходе' }.
 */
type StrictArgsMapping<TArgs extends Record<string, number>, TInput extends InputRecord> = {
  [K in ArgKey<TArgs>]-?: Extract<keyof TInput, string>
}

/** Строковые ключи набора `known`, если он есть. */
type KnownKeys<TKnown> =
  TKnown extends Partial<Record<string, number>> ? Extract<keyof TKnown, string> : never

/**
 * Какие аргументы ещё «не покрыты», если учитывать и входной объект, и known.
 * Если ничего не «теряется», то args- мэппинг опционален; иначе — обязателен.
 */
type MissingConsideringKnown<Need extends string, Have, Known extends string> = Exclude<
  Need,
  Known | Keys<Have>
>

type ArgsRequirement2<TInput extends InputRecord, TArgs extends Record<string, number>, TKnown> =
  MissingConsideringKnown<ArgKey<TArgs>, TInput, KnownKeys<TKnown>> extends never
    ? { args?: StrictArgsMapping<TArgs, TInput> }
    : { args: StrictArgsMapping<TArgs, TInput> }

/** Узкое утверждение: «похоже на обычный объект». */
function isObjectRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

/** Есть ли у значения строковый id (часто есть у TransformSpec). */
function hasStringId(x: unknown): x is { id: string } {
  return isObjectRecord(x) && typeof (x as { id?: unknown }).id === 'string'
}

/**
 * Безопасное описание значения для текста ошибки.
 */
function describeTransformValue(x: unknown): string {
  if (typeof x === 'string') return x
  if (
    typeof x === 'number' ||
    typeof x === 'boolean' ||
    typeof x === 'bigint' ||
    typeof x === 'symbol' ||
    typeof x === 'undefined'
  ) {
    return String(x)
  }
  if (typeof x === 'function') return '[Function]'
  if (hasStringId(x)) return `TransformSpec(id=${(x as { id: string }).id})`
  return '[Object]'
}
function isZodType(x: unknown): x is z.ZodType<InputRecord, ZodTypeDef, InputRecord> {
  return isObjectRecord(x) && typeof (x as { parse?: unknown }).parse === 'function'
}

/**
 * Унифицированная пост-обработка числа:
 *  - округление (round),
 *  - ограничение диапазоном (min/max),
 *  - единица измерения (unit) — делегируется в withNumberConversion.
 *
 * В «числовой» перегрузке вызывается сразу и возвращает число.
 * В «схемной» перегрузке аналогичная обёртка применяется к Zod-схеме.
 */
function finalizeNumber(
  value: number,
  unit: TransformSpec<Record<string, number>>['unit'],
  round?: number,
  min?: number,
  max?: number,
): number {
  const znum = withNumberConversion(z.number(), (x) => x, {
    round,
    range: { min, max },
    unit,
  })
  return znum.parse(value)
}

/* ====================== Перегрузки API ====================== */

/**
 * Перегрузка #1 (без схемы):
 * — Вызывается как withFormulaTransform({ transform, known, ...opts })
 * — Требует, чтобы known содержал значения ДЛЯ ВСЕХ аргументов формулы
 * — Сразу возвращает ГОТОВОЕ ЧИСЛО (округление/диапазон/единица уже применены)
 *
 * Использование:
 *   const x = withFormulaTransform({ transform, known: { a:1, b:2 }, round: 2 })
 */
export function withFormulaTransform<TArgs extends Record<string, number>>(
  opts: FormulaOptions<TArgs> & { known: Record<ArgKey<TArgs>, number> },
): number

/**
 * Перегрузка #2 (со схемой):
 * — Вызывается как withFormulaTransform(schema, { transform, known?, args?, ...opts })
 * — Возвращает Zod-СХЕМУ ЧИСЛА (её можно ставить в z.object({...}))
 * — При .parse(values) схема соберёт аргументы:
 *      1) попробует взять из known (если ключ там есть),
 *      2) иначе возьмёт из values по args-mapping (или по тому же ключу).
 *   Если каких-то значений нет/они нечисловые — будут ошибки валидации.
 *
 * Использование:
 *   const field = withFormulaTransform(z.object({ a:z.number(), b:z.number() }), { transform })
 *   const result = z.object({ field }).parse({ a:1, b:2 }).field
 */
export function withFormulaTransform<
  TSchema extends z.ZodType<InputRecord, ZodTypeDef, InputRecord>,
  TArgs extends Record<string, number>,
  TInput extends InputRecord = z.input<TSchema>,
  TKnown extends Partial<Record<ArgKey<TArgs>, number>> | undefined = undefined,
>(
  inputs: TSchema,
  opts: FormulaOptions<TArgs> & { known?: TKnown } & ArgsRequirement2<TInput, TArgs, TKnown>,
): z.ZodType<number, ZodTypeDef, z.input<TSchema>>

/** Реализация обеих перегрузок. */
export function withFormulaTransform(
  ...args: readonly unknown[]
): number | z.ZodType<number, ZodTypeDef, unknown> {
  // --- Ветка: один аргумент (known-only) → число
  if (args.length === 1) {
    const opts = args[0]
    if (!isObjectRecord(opts)) {
      throw new Error('withFormulaTransform: invalid call — expected options object.')
    }
    const { transform, instrument, round, min, max } = opts as {
      transform?: unknown
      instrument?: Instrument
      round?: number
      min?: number
      max?: number
    }
    if (
      !isObjectRecord(transform) ||
      !Array.isArray((transform as { inputs?: unknown }).inputs) ||
      typeof (transform as { compute?: unknown }).compute !== 'function'
    ) {
      const who = describeTransformValue(transform)
      throw new Error(`withFormulaTransform: invalid "transform". Got: ${who}.`)
    }

    const known = (opts as { known?: unknown }).known
    if (!isObjectRecord(known)) {
      throw new Error('withFormulaTransform: expected "known" with all required numeric args.')
    }

    const t = transform as TransformSpec<Record<string, number>>
    const keys = t.inputs
    const collected: Record<string, number> = {}

    for (const k of keys) {
      if (!Object.prototype.hasOwnProperty.call(known, k)) {
        throw new Error(`withFormulaTransform: missing known["${k}"].`)
      }
      const vk = known[k]
      const num = typeof vk === 'number' ? vk : Number(vk)
      if (!Number.isFinite(num)) {
        throw new Error(`withFormulaTransform: known["${k}"] must be a finite number.`)
      }
      collected[k] = num
    }

    const raw = t.compute(collected, { instrument })
    const safe = Number.isFinite(raw) ? raw : Number.NaN
    return finalizeNumber(safe, t.unit, round, min, max)
  }

  // --- Ветка: два аргумента (schema + opts) → ZodType<number, ...>
  if (args.length === 2) {
    const schemaArg = args[0]
    const opts = args[1]

    if (!isZodType(schemaArg)) {
      throw new Error('withFormulaTransform: first argument must be a Zod schema.')
    }
    if (!isObjectRecord(opts)) {
      throw new Error('withFormulaTransform: invalid options.')
    }

    const { transform, instrument, round, min, max } = opts as {
      transform?: unknown
      instrument?: Instrument
      round?: number
      min?: number
      max?: number
    }
    if (
      !isObjectRecord(transform) ||
      !Array.isArray((transform as { inputs?: unknown }).inputs) ||
      typeof (transform as { compute?: unknown }).compute !== 'function'
    ) {
      const who = describeTransformValue(transform)
      throw new Error(`withFormulaTransform: invalid "transform". Got: ${who}.`)
    }

    // args-мэппинг (если есть)
    const maybeArgs = (opts as { args?: unknown }).args
    let mapping: Record<string, string> | undefined
    if (isObjectRecord(maybeArgs)) {
      mapping = {}
      for (const [k, v] of Object.entries(maybeArgs)) {
        if (typeof v === 'string') mapping[k] = v
      }
    }

    // known (если есть)
    const known = (opts as { known?: unknown }).known as Record<string, unknown> | undefined

    const t = transform as TransformSpec<Record<string, number>>
    const keys = t.inputs

    // базовая Zod-схема поля
    const base: z.ZodType<number, ZodTypeDef, z.input<typeof schemaArg>> = schemaArg
      .superRefine((values, ctx) => {
        for (const k of keys) {
          if (known && Object.prototype.hasOwnProperty.call(known, k)) {
            const vk = known[k]
            const num = typeof vk === 'number' ? vk : Number(vk)
            if (!Number.isFinite(num)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [k],
                message: `known["${k}"] должно быть конечным числом.`,
              })
            }
            continue
          }
          const srcKey = mapping?.[k] ?? k
          const raw = (values as Record<string, unknown>)[srcKey]
          if (raw === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [srcKey],
              message: `Поле "${srcKey}" обязательно для формулы "${t.id}".`,
            })
            continue
          }
          const num = typeof raw === 'number' ? raw : Number(raw)
          if (!Number.isFinite(num)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [srcKey],
              message: `Поле "${srcKey}" должно быть конечным числом.`,
            })
          }
        }
      })
      .transform((values) => {
        if (!isObjectRecord(values)) return Number.NaN
        const dict = values as Record<string, unknown>

        const collected: Record<string, number> = {}
        for (const k of keys) {
          if (known && Object.prototype.hasOwnProperty.call(known, k)) {
            const vk = known[k]
            const num = typeof vk === 'number' ? vk : Number(vk)
            if (!Number.isFinite(num)) return Number.NaN
            collected[k] = num
            continue
          }
          const srcKey = mapping?.[k] ?? k
          const raw = dict[srcKey]
          const num = typeof raw === 'number' ? raw : Number(raw)
          if (!Number.isFinite(num)) return Number.NaN
          collected[k] = num
        }

        const result = t.compute(collected, { instrument })
        return Number.isFinite(result) ? result : Number.NaN
      })

    return withNumberConversion(base, (x) => x, {
      round,
      range: { min, max },
      unit: t.unit,
    })
  }

  throw new Error('withFormulaTransform: invalid call signature.')
}
