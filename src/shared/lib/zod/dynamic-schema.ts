// shared/lib/zod/dynamic-schema.ts
// ✅ Единственное место правки

import { z, ZodObject, type ZodRawShape } from 'zod'
import { logger } from '@/shared/lib/logger'

export const ANY_VALUE = '__ANY__'

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
  schema: z.ZodObject<any>
  Component: React.ComponentType<
    BaseDynamicComponentProps & {
      options?: TOptions
      responseData?: TResponseData
    }
  >
}

export type DynamicFieldConfig<RuleKey extends string = string> = ReadonlyArray<
  DynamicRule<any, any, RuleKey>
>

export type DynamicSectionsConfig<SectionKey extends string = string> = Readonly<
  Record<SectionKey, DynamicFieldConfig>
>

function isPresent(v: unknown) {
  return v !== null && v !== undefined && v !== ''
}

function valueMatchesCondition(formValue: unknown, cv: ConditionValue): boolean {
  if (cv === ANY_VALUE) return isPresent(formValue)
  if (Array.isArray(cv)) {
    if ((cv as any[]).includes(ANY_VALUE as any)) return isPresent(formValue)
    return (cv as any[]).includes(formValue as ConditionPrimitive)
  }
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

/* Хелпер для декларации секций с жёсткой типизацией ключей. */
export function createSectionsConfig<const T extends DynamicSectionsConfig<string>>(
  sections: T,
): T {
  return sections
}

/* Плоский список правил — удобно для схемы и вычислений. */
export function flattenRules(sections: DynamicSectionsConfig): DynamicFieldConfig {
  return Object.values(sections).flat()
}

/** Удаляем из values ключи правил, которые НЕ активны (и ни одним другим активным правилом не требуются). */
function stripInactiveRuleFields(
  values: Record<string, unknown>,
  rules: DynamicFieldConfig,
): Record<string, unknown> {
  const keyActiveMap = new Map<string, boolean>()
  for (const r of rules) {
    const keys = Object.keys((r as any).schema?.shape ?? {})
    const isActive = checkConditions(values, r)
    for (const k of keys) keyActiveMap.set(k, (keyActiveMap.get(k) ?? false) || isActive)
  }

  const cleaned: Record<string, unknown> = { ...values }
  for (const [k, isActiveKey] of keyActiveMap) {
    if (!isActiveKey && k in cleaned) delete cleaned[k]
  }
  return cleaned
}

/** Собираем множество ключей, которые принадлежат динамическим правилам. */
function collectRuleKeys(rules: DynamicFieldConfig): Set<string> {
  const set = new Set<string>()
  for (const r of rules) {
    const shape = (r as any).schema?.shape ?? {}
    Object.keys(shape).forEach((k) => set.add(k))
  }
  return set
}

/**
 * Делаем "смягчённую" базовую схему:
 * все ключи, которые хотя бы где-то валидируются правилами, становятся optional в base.
 * Их обязательность будет навешиваться ТОЛЬКО активными правилами.
 *
 * ⚠️ Мы НЕ меняем исходный объект baseSchema в коде форм — это локальная производная схема.
 */
function relaxBaseForRuleKeys<T extends ZodObject<ZodRawShape>>(
  base: T,
  rules: DynamicFieldConfig,
): T {
  // Получаем shape базовой схемы
  const baseShape = (base as any).shape as ZodRawShape
  const relaxedShape: ZodRawShape = { ...baseShape }
  const ruleKeys = collectRuleKeys(rules)

  for (const key of ruleKeys) {
    const def = relaxedShape[key]
    if (def && typeof (def as any).optional === 'function') {
      relaxedShape[key] = (def as any).optional()
    }
  }

  // Важно: сохраняем прочие свойства базовой схемы (passthrough/strict и т.п. у вас не используются)
  return z.object(relaxedShape) as unknown as T
}

/**
 * Динамическая Zod-схема.
 * 1) Очищаем значения неактивных полей.
 * 2) Валидируем ТОЛЬКО активные правила (их schema).
 * 3) Базовую схему применяем в "смягчённом" режиме: поля из правил — optional на уровне base.
 *    Поэтому ошибки по НЕАКТИВНЫМ полям не появятся, даже если в base они required.
 */
export function createDynamicSchema<T extends ZodObject<ZodRawShape>>(
  base: T,
  sections: DynamicSectionsConfig,
) {
  const rules = flattenRules(sections)
  const relaxedBase = relaxBaseForRuleKeys(base, rules)

  const processed = z.preprocess((input, ctx) => {
    if (typeof input !== 'object' || input === null) return input

    const stripped = stripInactiveRuleFields(input as Record<string, unknown>, rules)

    // Валидируем только активные правила поверх base
    for (const rule of rules) {
      if (checkConditions(stripped, rule)) {
        const r = rule.schema.safeParse(stripped)
        if (!r.success) r.error.issues.forEach((i) => ctx.addIssue(i))
      }
    }

    return stripped
  }, relaxedBase)

  // Сохраняем тип вывода из base; pipe нужен, чтобы не потерять эффекты preprocess.
  return z.any().pipe(processed)
}
