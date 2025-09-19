import type { FieldValues, Resolver, ResolverResult } from 'react-hook-form'
import { type ZodError, type ZodObject, type ZodRawShape } from 'zod'
import {
  buildValueNormalizerFromZod,
  checkConditions,
  flattenRules,
  type DynamicSectionsConfig,
} from '@/shared/lib/zod/dynamic-sections'
import { selectCandidatesFromTree } from '@/shared/lib/zod/dynamic-sections-scoped'

export function createDynamicResolver<TFieldValues extends FieldValues>(
  base: ZodObject<ZodRawShape>,
  sections: DynamicSectionsConfig,
): Resolver<TFieldValues> {
  const rules = flattenRules(sections)
  const relaxedBase = (function relax(base0: ZodObject<ZodRawShape>) {
    const set = new Set<string>()
    for (const r of rules) for (const k of Object.keys(r.schema.shape)) set.add(k)
    const patch: ZodRawShape = Object.create(null) as ZodRawShape
    const baseShape = base0.shape
    for (const key of set) if (baseShape[key]) patch[key] = baseShape[key].optional()
    return base0.extend(patch) as unknown as ZodObject<ZodRawShape>
  })(base)

  const normalize = buildValueNormalizerFromZod(base)

  // Для маппинга (section,indexInSection) → глобальный индекс rules[]
  const sectionToOffsets = new Map<string, number>()
  {
    let offset = 0
    for (const [sectionKey, arr] of Object.entries(sections as Record<string, unknown[]>)) {
      sectionToOffsets.set(sectionKey, offset)
      offset += arr.length
    }
  }

  // Предрасчёт: какие ключи к каким rules относятся (как было)
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

    // Кандидаты через дерево (если мета есть)
    const pairs = selectCandidatesFromTree(
      sections as DynamicSectionsConfig<string>,
      values as Record<string, unknown>,
      normalize,
    )

    const candidateIdxs = pairs
      ? pairs
          .map(({ section, indexInSection }) => {
            const off = sectionToOffsets.get(section)
            return typeof off === 'number' ? off + indexInSection : -1
          })
          .filter((x) => x >= 0)
      : // если дерево не прикреплено — проверяем все
        rules.map((_r, i) => i)

    const activeFlags = new Array<boolean>(rules.length).fill(false)
    for (const i of candidateIdxs) {
      activeFlags[i] = checkConditions(values as Record<string, unknown>, rules[i], {
        normalize,
        tag: 'dynamic-resolver',
      })
    }

    const stripped: Record<string, unknown> = { ...(values as Record<string, unknown>) }
    for (const [key, owners] of keyToRuleIdx) {
      const isActiveForKey = owners.some((i) => activeFlags[i])
      if (!isActiveForKey) delete stripped[key]
    }

    const baseResult = relaxedBase.safeParse(stripped)
    const errorsMap: Record<string, { type: string; message?: string }> = {}
    if (!baseResult.success) {
      for (const iss of (baseResult as { error: ZodError }).error.issues) {
        const name = iss.path.map(String).join('.')
        if (!errorsMap[name]) errorsMap[name] = { type: 'zod_base', message: iss.message }
      }
    }

    for (const i of candidateIdxs) {
      if (!activeFlags[i]) continue
      const r = rules[i].schema.safeParse(stripped)
      if (!r.success) {
        for (const iss of (r as { error: ZodError }).error.issues) {
          const name = iss.path.map(String).join('.')
          if (!errorsMap[name]) errorsMap[name] = { type: `zod_rule_${i}`, message: iss.message }
        }
      }
    }

    if (Object.keys(errorsMap).length > 0) {
      return {
        values: {} as TFieldValues,
        errors: errorsMap as unknown as ResolverResult<TFieldValues>['errors'],
      }
    }
    return {
      values: (baseResult.success ? baseResult.data : stripped) as unknown as TFieldValues,
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
