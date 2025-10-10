import type { FieldValues, Resolver, ResolverResult } from 'react-hook-form'
import { type ZodError, type ZodObject, type ZodRawShape } from 'zod'
import {
  buildValueNormalizerFromZod,
  checkConditions,
  flattenRules,
  setDeep,
  type DynamicSectionsConfig,
} from '@/shared/lib/zod/dynamic-sections'
import { selectCandidatesFromTree } from '@/shared/lib/zod/dynamic-sections-scoped'

/**
 * Семантика:
 *  - если правило для ключа АКТИВНО → базовая схема для этого ключа не применяется (полное перекрытие),
 *    в т.ч. required/минимумы/максимумы; берём только динамическую схему.
 *  - если правило НЕ активно → ключ валидируется базовой схемой (как есть).
 */
export function createDynamicResolver<TFieldValues extends FieldValues>(
  base: ZodObject<ZodRawShape>,
  sections: DynamicSectionsConfig,
): Resolver<TFieldValues> {
  const rules = flattenRules(sections)
  const normalize = buildValueNormalizerFromZod(base)

  // Предрассчёт
  const ruleSchemaKeys = rules.map((r) => Object.keys(r.schema.shape))

  // Смещения секций -> глобальный индекс правила
  const sectionToOffsets = new Map<string, number>()
  {
    let offset = 0
    for (const [sectionKey, arr] of Object.entries(sections as Record<string, unknown[]>)) {
      sectionToOffsets.set(sectionKey, offset)
      offset += arr.length
    }
  }

  return (values) => {
    const v = values as Record<string, unknown>

    // Отбираем кандидатов и определяем активные правила
    const pairs = selectCandidatesFromTree(sections as DynamicSectionsConfig<string>, v, normalize)
    const candidateIdxs = pairs
      ? pairs
          .map(({ section, indexInSection }) => {
            const off = sectionToOffsets.get(section)
            return typeof off === 'number' ? off + indexInSection : -1
          })
          .filter((i) => i >= 0)
      : rules.map((_r, i) => i)

    const activeFlags = new Array<boolean>(rules.length).fill(false)
    for (const i of candidateIdxs) {
      activeFlags[i] = checkConditions(v, rules[i], {
        normalize,
        tag: 'dynamic-resolver',
      })
    }

    // Множество динамических ключей, которые ПЕРЕКРЫВАЮТСЯ (только активные)
    const activeDynamicKeys = new Set<string>()
    for (let i = 0; i < rules.length; i++) {
      if (!activeFlags[i]) continue
      for (const k of ruleSchemaKeys[i]) activeDynamicKeys.add(k)
    }

    // (опционально) детект конфликтов: один ключ обслуживают несколько активных правил
    // если такое допустимо в твоей модели — можно убрать этот блок
    for (const k of activeDynamicKeys) {
      let owners = 0
      for (let i = 0; i < rules.length; i++) {
        if (activeFlags[i] && ruleSchemaKeys[i].includes(k)) owners++
        if (owners > 1) {
          const errors = {
            [k]: {
              type: 'dynamic_conflict',
              message: `Поле "${k}" перекрыто несколькими активными правилами`,
            },
          } as unknown as ResolverResult<TFieldValues>['errors']
          return { values: {} as TFieldValues, errors }
        }
      }
    }

    const errorsMap: Record<string, { type: string; message?: string }> = {}
    const result: Record<string, unknown> = { ...v } // промежуточный буфер

    // Валидируем ТОЛЬКО активные правила, применяем transform и перезаписываем их ключи
    for (const i of candidateIdxs) {
      if (!activeFlags[i]) continue
      const rule = rules[i]
      const parsed = rule.schema.safeParse(result)
      if (parsed.success) {
        const data = parsed.data
        for (const k of ruleSchemaKeys[i]) {
          // Перекрываем базу: динамика полностью управляет этим ключом
          result[k] = data[k]
        }
      } else {
        for (const iss of (parsed as { error: ZodError }).error.issues) {
          const name = iss.path.map(String).join('.')
          setDeep(errorsMap, name, { type: `zod_rule_${i}`, message: iss.message })
        }
      }
    }

    // Валидируем только те ключи, которые НЕ перекрыты динамикой
    //    Т.е. для activeDynamicKeys база не применяется вообще.
    const baseKeys = Object.keys(base.shape)
    const baseKeysToValidate = baseKeys.filter((k) => !activeDynamicKeys.has(k))

    // Если нечего проверять — пропускаем base.safeParse (экономим)
    if (baseKeysToValidate.length > 0) {
      const basePick = base.pick(
        Object.fromEntries(baseKeysToValidate.map((k) => [k, true])) as Record<string, true>,
      )
      const baseParsed = basePick.safeParse(result)
      if (!baseParsed.success) {
        for (const iss of (baseParsed as { error: ZodError }).error.issues) {
          const name = iss.path.map(String).join('.')
          setDeep(errorsMap, name, { type: 'zod_base', message: iss.message })
        }
      } else {
        // Применяем базовые transform только к НЕперекрытым ключам
        const data = baseParsed.data as Record<string, unknown>
        for (const k of baseKeysToValidate) result[k] = data[k]
      }
    }

    if (Object.keys(errorsMap).length > 0) {
      return {
        values: {} as TFieldValues,
        errors: errorsMap as unknown as ResolverResult<TFieldValues>['errors'],
      }
    }

    return {
      values: result as unknown as TFieldValues,
      errors: {} as ResolverResult<TFieldValues>['errors'],
    }
  }
}

// Чтобы не таскать нормализатор руками в провайдер
export function createDynamicEngine<TFieldValues extends FieldValues>(
  base: ZodObject<ZodRawShape>,
  sections: DynamicSectionsConfig,
) {
  const resolver = createDynamicResolver<TFieldValues>(base, sections)
  const valueNormalizer = buildValueNormalizerFromZod(base)

  const basePickParse = (keys: string[], input: Record<string, unknown>) => {
    const pick = base.pick(Object.fromEntries(keys.map((k) => [k, true])) as Record<string, true>)
    const subset = Object.fromEntries(keys.map((k) => [k, input[k]]))
    const parsed = pick.safeParse(subset)
    return parsed.success ? parsed.data : subset
  }

  return { resolver, valueNormalizer, basePickParse }
}
