import { z, ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod'
import { logger } from '@/shared/lib/logger'
import { getCoreSchema, normalizeBySchema } from '@/shared/lib/zod/zod-normalize'

export const ANY_VALUE = '__ANY__' as const

export type ConditionPredicateCtx = { form: Record<string, unknown> }
export type ConditionPredicate = (value: unknown, ctx: ConditionPredicateCtx) => boolean

type ConditionPrimitive = string | number | boolean
type ConditionValue = ConditionPrimitive | ConditionPrimitive[] | ConditionPredicate
export type ConditionsMap = Record<string, ConditionValue>

export type BaseDynamicComponentProps = object

export interface DynamicRule<
  TOptions extends object = object,
  TResponseData = unknown,
  RuleKey extends string = string,
> {
  id: RuleKey
  conditions: ConditionsMap
  exceptions?: ConditionsMap
  schema: z.ZodObject<
    ZodRawShape,
    z.UnknownKeysParam,
    z.ZodTypeAny,
    Record<string, unknown>,
    Record<string, unknown>
  >
  Component: React.ComponentType<
    BaseDynamicComponentProps & {
      options?: TOptions
      responseData?: TResponseData
    }
  >
}

export type DynamicFieldConfig<RuleKey extends string = string> = ReadonlyArray<
  DynamicRule<object, unknown, RuleKey>
>

export type DynamicSectionsConfig<SectionKey extends string = string> = Readonly<
  Record<SectionKey, DynamicFieldConfig>
>

type DynamicRuleInput = Omit<DynamicRule, 'id'> & { id?: string }
type DynamicFieldConfigInput = ReadonlyArray<DynamicRuleInput>
type DynamicSectionsInput<S extends string = string> = Readonly<Record<S, DynamicFieldConfigInput>>

/** Простой автогенератор id: <section>:<index> */
function autoRuleId(section: string, index: number): string {
  return `${section}:${index}`
}

/** Лёгкая проверка коллизий id внутри секции (warn) */
function warnOnDuplicateIds(section: string, rules: DynamicRule[]): void {
  const seen = new Set<string>()
  for (const r of rules) {
    if (seen.has(r.id)) {
      logger.warn(`[dynamic-schema] Duplicate rule id in section '${section}': '${r.id}'`)
    } else {
      seen.add(r.id)
    }
  }
}

/** Создание секций с автоподстановкой id там, где он не указан. */
export function createSectionsConfig<S extends string>(
  sections: DynamicSectionsInput<S>,
): DynamicSectionsConfig<S> {
  const result: Record<S, DynamicRule[]> = {} as Record<S, DynamicRule[]>

  // Object.keys безопасно приводим к S[]
  for (const sectionKey of Object.keys(sections) as S[]) {
    const src = sections[sectionKey] // тип: ReadonlyArray<DynamicRuleInput>
    const mapped: DynamicRule[] = src.map((rule, idx) => ({
      ...rule,
      id: rule.id ?? autoRuleId(sectionKey, idx),
    }))
    warnOnDuplicateIds(sectionKey, mapped)
    result[sectionKey] = mapped
  }

  return result as DynamicSectionsConfig<S>
}

export function flattenRules(sections: DynamicSectionsConfig): DynamicFieldConfig {
  return Object.values(sections).flat()
}

// Нормализатор значений для checkConditions
export type ValueNormalizer = (key: string, value: unknown) => unknown
const identityNormalizer: ValueNormalizer = (_key, v) => v

/** Построить нормализатор значений на основе base-схемы (использует ту же логику, что zn) */
export function buildValueNormalizerFromZod<T extends ZodObject<ZodRawShape>>(
  base: T,
): ValueNormalizer {
  const shape = base.shape
  const map = new Map<string, ZodTypeAny>()
  for (const k of Object.keys(shape)) map.set(k, shape[k])
  return (key: string, value: unknown) => {
    const s = map.get(key)
    return s ? normalizeBySchema(getCoreSchema(s), value) : value
  }
}

function isPresent(v: unknown) {
  return v !== null && v !== undefined && v !== ''
}

function isPresenceBased(cv: ConditionValue): boolean {
  return cv === ANY_VALUE || (Array.isArray(cv) && (cv as ConditionPrimitive[]).includes(ANY_VALUE))
}

function isPredicate(cv: ConditionValue): cv is ConditionPredicate {
  return typeof cv === 'function'
}

// Включаем нормализацию и предикаты
function valueMatchesCondition(
  formValueRaw: unknown,
  cv: ConditionValue,
  key: string,
  normalize: ValueNormalizer,
  formData: Record<string, unknown>,
): boolean {
  const formValue = normalize(key, formValueRaw)

  // Если значения по факту нет — ни один предикат не должен срабатывать
  if (isPredicate(cv)) {
    if (formValue === '' || formValue === undefined || formValue === null) return false
    return cv(formValue, { form: formData })
  }

  if (isPresenceBased(cv)) return isPresent(formValue)

  if (Array.isArray(cv)) {
    const normalized = (cv as ConditionPrimitive[]).map((x) => normalize(key, x))
    return normalized.some((x) => Object.is(x, formValue))
  }

  const rhs = normalize(key, cv)
  return Object.is(formValue, rhs)
}

export type CheckOptions = { normalize?: ValueNormalizer; tag?: string }

function valueToSig(v: unknown): string {
  const t = typeof v
  if (v === null) return 'null'
  if (t === 'number') {
    const n = v as number
    if (Number.isNaN(n)) return 'number:NaN'
    if (!Number.isFinite(n)) return `number:${n > 0 ? 'Infinity' : '-Infinity'}`
    return `number:${n}`
  }
  if (t === 'string') return `string:${v as string}`
  if (t === 'boolean') return `boolean:${(v as boolean) ? 'true' : 'false'}`
  if (t === 'undefined') return 'undefined:undefined'
  if (t === 'bigint') return `bigint:${(v as bigint).toString()}`
  return t
}

// Ключ: `${tag}:${field}` → последняя сигнатура значения
const lastLogSig = new Map<string, string>()

export function checkConditions(
  formData: Record<string, unknown>,
  rule: DynamicRule,
  opts?: CheckOptions,
): boolean {
  const { conditions, exceptions } = rule
  const normalize = opts?.normalize ?? identityNormalizer
  const tag = opts?.tag ?? 'dynamic'

  for (const name in conditions) {
    const norm = normalize(name, formData[name])
    const sig = `${valueToSig(norm)}|${String(conditions[name])}`
    const key = `${tag}:${name}`
    if (lastLogSig.get(key) !== sig) {
      lastLogSig.set(key, sig)
      logger.debug(
        `[dynamic-schema/${tag}] Checking field: '${name}'. Raw:`,
        formData[name],
        '→ normalized:',
        norm,
        '→ condition:',
        conditions[name],
      )
    }
    if (!valueMatchesCondition(formData[name], conditions[name], name, normalize, formData)) {
      return false
    }
  }
  if (exceptions) {
    for (const name in exceptions) {
      if (valueMatchesCondition(formData[name], exceptions[name], name, normalize, formData)) {
        return false
      }
    }
  }
  return true
}
