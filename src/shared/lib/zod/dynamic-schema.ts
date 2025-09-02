import { z, ZodObject, type ZodRawShape } from 'zod'
import { logger } from '@/shared/lib/logger'

export const ANY_VALUE = '__ANY__' as const

type ConditionPrimitive = string | number | boolean
type ConditionValue = ConditionPrimitive | ConditionPrimitive[]
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

function isPresent(v: unknown) {
  return v !== null && v !== undefined && v !== ''
}

function isPresenceBased(cv: ConditionValue): boolean {
  return cv === ANY_VALUE || (Array.isArray(cv) && (cv as ConditionPrimitive[]).includes(ANY_VALUE))
}

function valueMatchesCondition(formValue: unknown, cv: ConditionValue): boolean {
  if (isPresenceBased(cv)) return isPresent(formValue)
  if (Array.isArray(cv))
    return (cv as ConditionPrimitive[]).includes(formValue as ConditionPrimitive)
  return formValue === cv
}

export function checkConditions(formData: Record<string, unknown>, rule: DynamicRule): boolean {
  const { conditions, exceptions } = rule
  for (const name in conditions) {
    logger.debug(
      `[dynamic-schema] Checking field: '${name}'. Form value is:`,
      formData[name],
      `Type: ${typeof formData[name]}`,
    )
    if (!valueMatchesCondition(formData[name], conditions[name])) return false
  }
  if (exceptions) {
    for (const name in exceptions) {
      if (valueMatchesCondition(formData[name], exceptions[name])) return false
    }
  }
  return true
}

/* Декларация секций с жёсткой типизацией ключей. */
export function createSectionsConfig<const T extends DynamicSectionsConfig<string>>(
  sections: T,
): T {
  return sections
}

/* Плоский список правил. */
export function flattenRules(sections: DynamicSectionsConfig): DynamicFieldConfig {
  return Object.values(sections).flat()
}

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
    // Добавляем только существующие в base ключи
    if (def) {
      patch[key] = def.optional()
    }
  }

  return (base as ZodObject<ZodRawShape>).extend(patch) as unknown as T
}

type SignatureMode = 'presence' | 'value'
type RuleCondEntry = { key: string; mode: SignatureMode }

/** Подготовка entries для подписи каждого правила (dedup + «value» сильнее «presence» + сортировка). */
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

    // Детерминированный порядок — по ключу
    return Array.from(dedup.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, mode]) => ({ key, mode }))
  })
}

/** Безопасная сигнатура значения: без JSON.stringify, чтобы не падать на BigInt/циклах. */
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
  // object/function/symbol — нам достаточно факта типа + presence
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

/**
 * Динамическая Zod-схема с покомпонентной мемоизацией:
 * - для каждого правила считаем свою подпись (presence/value);
 * - пересчитываем и логируем только правила с изменившейся подписью;
 * - удаляем ВСЕ поля неактивных правил (в т.ч. никогда не активировавшихся).
 *
 * ВАЖНО: схема содержит внутреннее состояние; создавай её на инстанс формы,
 * не шарь один и тот же объект схемы между конкурентными запросами/пользователями.
 */
export function createDynamicSchema<T extends ZodObject<ZodRawShape>>(
  base: T,
  sections: DynamicSectionsConfig,
) {
  const rules = flattenRules(sections)
  const relaxedBase = relaxBaseForRuleKeys(base, rules)

  const ruleCondEntries = prepareRuleCondEntries(rules)
  const ruleSchemaKeys = rules.map((r) => Object.keys(r.schema.shape))

  // Все rule-keys (нужны для корректного strip с самого старта)
  const allRuleKeys = new Set<string>(ruleSchemaKeys.flat())

  // Кэш состояния
  let initialized = false
  let lastRuleSigs: string[] = []
  let activeRuleFlags: boolean[] = []

  // Счётчики активности по ключам (ключ присутствует => cnt>0)
  const keyActiveCount = new Map<string, number>()
  // Инициализируем НУЛЯМИ для всех rule-keys, чтобы strip работал даже если правило НИКОГДА не включалось
  for (const k of allRuleKeys) keyActiveCount.set(k, 0)

  // Вычисляем map активности ключей (true, если cnt>0)
  const buildActiveKeyMap = (): Map<string, boolean> => {
    const m = new Map<string, boolean>()
    for (const k of allRuleKeys) m.set(k, (keyActiveCount.get(k) ?? 0) > 0)
    return m
  }
  let activeKeyMap: Map<string, boolean> = new Map()

  const processed = z.preprocess((input, ctx) => {
    if (typeof input !== 'object' || input === null) return input
    const rawValues = input as Record<string, unknown>

    // Первый вызов — полная инициализация без двойного инкремента
    if (!initialized) {
      lastRuleSigs = rules.map((_, i) => buildRuleSignature(rawValues, ruleCondEntries[i]))
      activeRuleFlags = rules.map((r) => checkConditions(rawValues, r))

      // Счётчики ключей
      for (let i = 0; i < rules.length; i++) {
        if (activeRuleFlags[i]) {
          for (const k of ruleSchemaKeys[i]) keyActiveCount.set(k, (keyActiveCount.get(k) ?? 0) + 1)
        }
      }

      activeKeyMap = buildActiveKeyMap()
      initialized = true
    } else {
      // Частичный пересчёт активности правил по их индивидуальным подписям
      let anyRuleToggled = false

      for (let i = 0; i < rules.length; i++) {
        const sig = buildRuleSignature(rawValues, ruleCondEntries[i])
        if (sig === lastRuleSigs[i]) continue
        lastRuleSigs[i] = sig

        const prev = activeRuleFlags[i]
        const next = checkConditions(rawValues, rules[i]) // лог сработает ТОЛЬКО при изменении подписи
        if (prev !== next) {
          activeRuleFlags[i] = next
          anyRuleToggled = true
          const keys = ruleSchemaKeys[i]
          if (next) {
            for (const k of keys) keyActiveCount.set(k, (keyActiveCount.get(k) ?? 0) + 1)
          } else {
            for (const k of keys)
              keyActiveCount.set(k, Math.max(0, (keyActiveCount.get(k) ?? 0) - 1))
          }
        }
      }

      // Обновляем карту активности ключей только при изменениях
      if (anyRuleToggled) {
        activeKeyMap = buildActiveKeyMap()
      }
    }

    //  Стрип неактивных полей (включая те, что НИ РАЗУ не были активны)
    const stripped: Record<string, unknown> = { ...rawValues }
    for (const k of allRuleKeys) {
      const isActive = activeKeyMap.get(k) ?? false
      if (!isActive && k in stripped) delete stripped[k]
    }

    // Валидируем только активные rule-схемы поверх base
    for (let i = 0; i < rules.length; i++) {
      if (!activeRuleFlags[i]) continue
      const r = rules[i].schema.safeParse(stripped)
      if (!r.success) r.error.issues.forEach((iss) => ctx.addIssue(iss))
    }

    return stripped
  }, relaxedBase)

  // pipe — чтобы сохранить вывод base-типа
  return z.any().pipe(processed)
}
