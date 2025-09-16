import { z, ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod'
import { logger } from '@/shared/lib/logger'
import { getCoreSchema, normalizeBySchema } from '@/shared/lib/zod/zod-normalize'

export const ANY_VALUE = '__ANY__' as const

export type ConditionPredicateCtx = { form: Record<string, unknown> }
export type ConditionPredicate = (value: unknown, ctx: ConditionPredicateCtx) => boolean

type ConditionPrimitive = string | number | boolean
type ConditionValue = ConditionPrimitive | ConditionPrimitive[] | ConditionPredicate
type ConditionsMap = Record<string, ConditionValue>

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

export function createSectionsConfig<const T extends DynamicSectionsConfig<string>>(
  sections: T,
): T {
  return sections
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

export type CheckOptions = { normalize?: ValueNormalizer }

export function checkConditions(
  formData: Record<string, unknown>,
  rule: DynamicRule,
  opts?: CheckOptions,
): boolean {
  const { conditions, exceptions } = rule
  const normalize = opts?.normalize ?? identityNormalizer

  for (const name in conditions) {
    logger.debug(
      `[dynamic-schema] Checking field: '${name}'. Raw:`,
      formData[name],
      `→ normalized:`,
      normalize(name, formData[name]),
    )
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

// === Ниже — прежняя логика динамической схемы, но с учётом normalize + предикатов ===

/** Все ключи, валидируемые правилами. */
function collectRuleKeys(rules: DynamicFieldConfig): Set<string> {
  const set = new Set<string>()
  for (const r of rules) {
    const shape = r.schema.shape
    Object.keys(shape).forEach((k) => set.add(k))
  }
  return set
}

/** «Мягчим» базовую схему: rule-keys становятся optional на уровне base. */
function relaxBaseForRuleKeys<T extends ZodObject<ZodRawShape>>(
  base: T,
  rules: DynamicFieldConfig,
): T {
  const ruleKeys = collectRuleKeys(rules)
  const patch: ZodRawShape = Object.create(null) as ZodRawShape
  const baseShape = base.shape
  for (const key of ruleKeys) {
    const def = baseShape[key]
    if (def) patch[key] = def.optional()
  }
  return (base as ZodObject<ZodRawShape>).extend(patch) as unknown as T
}

type SignatureMode = 'presence' | 'value'
type RuleCondEntry = { key: string; mode: SignatureMode }

/** Подготовка entries для подписи каждого правила (учитываем предикаты как 'value'). */
function prepareRuleCondEntries(rules: DynamicFieldConfig): RuleCondEntry[][] {
  return rules.map((r) => {
    const dedup = new Map<string, SignatureMode>()
    const push = (obj?: ConditionsMap) => {
      if (!obj) return
      for (const [k, cv] of Object.entries(obj)) {
        const m: SignatureMode = isPresenceBased(cv) ? 'presence' : 'value'
        const prev = dedup.get(k)
        if (!prev || (prev === 'presence' && m === 'value')) dedup.set(k, m)
      }
    }
    push(r.conditions)
    push(r.exceptions)
    return Array.from(dedup.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, mode]) => ({ key, mode }))
  })
}

/** Безопасная сигнатура значения */
function valueToSig(v: unknown): string {
  const t = typeof v
  if (v === null) return 'null'
  if (t === 'number') {
    const num = v as number
    if (Number.isNaN(num)) return 'number:NaN'
    if (!Number.isFinite(num)) return `number:${num > 0 ? 'Infinity' : '-Infinity'}`
    return `number:${num}`
  }
  if (t === 'string') return `string:${v as string}`
  if (t === 'boolean') return `boolean:${(v as boolean) ? 'true' : 'false'}`
  if (t === 'undefined') return 'undefined:undefined'
  if (t === 'bigint') return `bigint:${(v as bigint).toString()}`
  return t
}

/** Подпись конкретного правила по его condition-entries. */
function buildRuleSignature(values: Record<string, unknown>, entries: RuleCondEntry[]): string {
  if (entries.length === 0) return '∅'
  let buf = ''
  for (const { key, mode } of entries) {
    const v = values[key]
    const present = isPresent(v) ? 1 : 0
    if (mode === 'presence') buf += `${key}:P:${present}|`
    else buf += `${key}:V:${valueToSig(v)}:${present}|`
  }
  return buf
}

/** Динамическая Zod-схема + мемоизация (как было), но с нормализацией и предикатами */
export function createDynamicSchema<T extends ZodObject<ZodRawShape>>(
  base: T,
  sections: DynamicSectionsConfig,
) {
  const rules = flattenRules(sections)
  const relaxedBase = relaxBaseForRuleKeys(base, rules)
  const normalize = buildValueNormalizerFromZod(base)

  const ruleCondEntries = prepareRuleCondEntries(rules)
  const ruleSchemaKeys = rules.map((r) => Object.keys(r.schema.shape))
  const allRuleKeys = new Set<string>(ruleSchemaKeys.flat())

  let initialized = false
  let lastRuleSigs: string[] = []
  let activeRuleFlags: boolean[] = []

  const keyActiveCount = new Map<string, number>()
  for (const k of allRuleKeys) keyActiveCount.set(k, 0)

  const buildActiveKeyMap = (): Map<string, boolean> => {
    const m = new Map<string, boolean>()
    for (const k of allRuleKeys) m.set(k, (keyActiveCount.get(k) ?? 0) > 0)
    return m
  }
  let activeKeyMap: Map<string, boolean> = new Map()

  const processed = z.preprocess((input, ctx) => {
    if (typeof input !== 'object' || input === null) return input
    const rawValues = input as Record<string, unknown>

    if (!initialized) {
      lastRuleSigs = rules.map((_, i) => buildRuleSignature(rawValues, ruleCondEntries[i]))
      activeRuleFlags = rules.map((r) => checkConditions(rawValues, r, { normalize }))
      for (let i = 0; i < rules.length; i++) {
        if (activeRuleFlags[i]) {
          for (const k of ruleSchemaKeys[i]) keyActiveCount.set(k, (keyActiveCount.get(k) ?? 0) + 1)
        }
      }
      activeKeyMap = buildActiveKeyMap()
      initialized = true
    } else {
      let anyRuleToggled = false
      for (let i = 0; i < rules.length; i++) {
        const sig = buildRuleSignature(rawValues, ruleCondEntries[i])
        if (sig === lastRuleSigs[i]) continue
        lastRuleSigs[i] = sig

        const prev = activeRuleFlags[i]
        const next = checkConditions(rawValues, rules[i], { normalize })
        if (prev !== next) {
          activeRuleFlags[i] = next
          anyRuleToggled = true
          const keys = ruleSchemaKeys[i]
          if (next) for (const k of keys) keyActiveCount.set(k, (keyActiveCount.get(k) ?? 0) + 1)
          else
            for (const k of keys)
              keyActiveCount.set(k, Math.max(0, (keyActiveCount.get(k) ?? 0) - 1))
        }
      }
      if (anyRuleToggled) activeKeyMap = buildActiveKeyMap()
    }

    const stripped: Record<string, unknown> = { ...rawValues }
    for (const k of allRuleKeys) {
      const isActive = activeKeyMap.get(k) ?? false
      if (!isActive && k in stripped) delete stripped[k]
    }

    for (let i = 0; i < rules.length; i++) {
      if (!activeRuleFlags[i]) continue
      const r = rules[i].schema.safeParse(stripped)
      if (!r.success) r.error.issues.forEach((iss) => ctx.addIssue(iss))
    }
    return stripped
  }, relaxedBase)

  return z.any().pipe(processed)
}
