import type { FieldValues, Resolver, ResolverResult } from 'react-hook-form'
import { z, type ZodError, type ZodIssue, type ZodObject, type ZodRawShape } from 'zod'
import {
  buildValueNormalizerFromZod,
  checkConditions,
  flattenRules,
  type DynamicSectionsConfig,
} from '@/shared/lib/zod/dynamic-schema'

// Делаем relaxed-базу (rule-keys -> optional)
function collectRuleKeys(rules: ReturnType<typeof flattenRules>): Set<string> {
  const set = new Set<string>()
  for (const r of rules) {
    const shape = r.schema.shape
    Object.keys(shape).forEach((k) => set.add(k))
  }
  return set
}

function relaxBaseForRuleKeys<T extends ZodObject<ZodRawShape>>(
  base: T,
  rules: ReturnType<typeof flattenRules>,
): T {
  const ruleKeys = collectRuleKeys(rules)
  const patch: ZodRawShape = Object.create(null) as ZodRawShape
  const baseShape = base.shape
  for (const key of ruleKeys) {
    const def = baseShape[key]
    if (def) patch[key] = def.optional()
  }
  return (base as z.ZodObject<ZodRawShape>).extend(patch) as unknown as T
}

// Маппинг ошибок Zod -> формат RHF (плоские ключи с dot-notation) ----
type FlatRHFError = { type: string; message?: string }
function joinPath(path: Array<string | number>): string {
  return path.map((p) => String(p)).join('.')
}
function pushIssues(target: Record<string, FlatRHFError>, issues: ZodIssue[], type = 'zod'): void {
  for (const iss of issues) {
    const name = joinPath(iss.path)
    // Сохраняем первое сообщение по ключу, чтобы не «мигать» ошибками
    if (!target[name]) target[name] = { type, message: iss.message }
  }
}
function toResolverErrors<TFieldValues extends FieldValues>(
  map: Record<string, FlatRHFError>,
): ResolverResult<TFieldValues>['errors'] {
  // RHF поддерживает плоские ключи с dot-notation, приведём тип безопасно
  return map as unknown as ResolverResult<TFieldValues>['errors']
}

// Основной фабричный метод: кастомный resolver
export function createDynamicResolver<TFieldValues extends FieldValues>(
  base: ZodObject<ZodRawShape>,
  sections: DynamicSectionsConfig,
): Resolver<TFieldValues> {
  const rules = flattenRules(sections)
  const relaxedBase = relaxBaseForRuleKeys(base, rules)
  const normalize = buildValueNormalizerFromZod(base)

  // Предрасчёт: какие ключи к каким rules относятся
  const ruleSchemaKeys = rules.map((r) => Object.keys(r.schema.shape))
  const keyToRuleIdx = new Map<string, number[]>()
  ruleSchemaKeys.forEach((keys, idx) => {
    keys.forEach((k) => {
      const arr = keyToRuleIdx.get(k)
      if (arr) arr.push(idx)
      else keyToRuleIdx.set(k, [idx])
    })
  })

  return (values, _context, _options) => {
    void _context
    void _options
    // Вычисляем активные правила на нормализованных значениях
    const activeFlags = rules.map((r) =>
      checkConditions(values as Record<string, unknown>, r, { normalize }),
    )

    // Удаляем значения ключей, которые не требуются ни одним активным правилом
    const stripped: Record<string, unknown> = { ...(values as Record<string, unknown>) }
    for (const [key, owners] of keyToRuleIdx) {
      const isActiveForKey = owners.some((i) => activeFlags[i])
      if (!isActiveForKey) delete stripped[key]
    }

    // Валидируем relaxed-базу (учитывает optional для rule-keys)
    const baseResult = relaxedBase.safeParse(stripped)
    const errorsMap: Record<string, FlatRHFError> = {}

    if (!baseResult.success) {
      pushIssues(errorsMap, (baseResult as { error: ZodError }).error.issues, 'zod_base')
    }

    // Валидируем только АКТИВНЫЕ rule-схемы
    for (let i = 0; i < rules.length; i++) {
      if (!activeFlags[i]) continue
      const r = rules[i].schema.safeParse(stripped)
      if (!r.success)
        pushIssues(errorsMap, (r as { error: ZodError }).error.issues, `zod_rule_${i}`)
    }

    // Возвращаем результат в формате RHF
    const hasErrors = Object.keys(errorsMap).length > 0
    if (hasErrors) {
      return {
        values: {} as TFieldValues, // RHF игнорит values при наличии errors
        errors: toResolverErrors<TFieldValues>(errorsMap),
      }
    }

    // Если базовая схема имеет трансформации — заберём нормализованные data
    // Иначе оставим stripped.
    const finalValues = baseResult.success
      ? (baseResult.data as unknown as TFieldValues)
      : (stripped as TFieldValues)
    return {
      values: finalValues,
      errors: {} as ResolverResult<TFieldValues>['errors'],
    }
  }
}

// Чтобы не таскать нормализатор руками в провайдер
export function createDynamicEngine<TFieldValues extends FieldValues>(
  base: ZodObject<ZodRawShape>,
  sections: DynamicSectionsConfig,
) {
  return {
    resolver: createDynamicResolver<TFieldValues>(base, sections),
    valueNormalizer: buildValueNormalizerFromZod(base),
  }
}
