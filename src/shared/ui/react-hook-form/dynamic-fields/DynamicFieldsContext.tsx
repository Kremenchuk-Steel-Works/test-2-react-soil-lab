import { createContext, memo, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFormContext, useWatch, type FieldPath, type FieldValues } from 'react-hook-form'
import { createLogger } from '@/shared/lib/logger'
import {
  checkConditions,
  flattenRules,
  type DynamicSectionsConfig,
} from '@/shared/lib/zod/dynamic-schema'

const logger = createLogger('DynamicFields')

type ActiveRulesState<RuleKey extends string = string> = Record<RuleKey, boolean>

type DynamicMeta<TOptions extends object, TResponseData, SectionKey extends string> = {
  sections: DynamicSectionsConfig<SectionKey>
  options?: TOptions
  responseData?: TResponseData
}

const ActiveRulesContext = createContext<ActiveRulesState<any> | null>(null)
const DynamicMetaContext = createContext<DynamicMeta<any, any, any> | null>(null)

interface ProviderProps<
  TOptions extends object,
  TResponseData,
  SectionKey extends string = string,
> {
  sections: DynamicSectionsConfig<SectionKey>
  options?: TOptions
  responseData?: TResponseData
  children: ReactNode
}

export const DynamicFieldsProvider = memo(function DynamicFieldsProvider<
  TFieldValues extends FieldValues,
  TOptions extends object,
  TResponseData,
  SectionKey extends string = string,
>({
  children,
  sections,
  options,
  responseData,
}: ProviderProps<TOptions, TResponseData, SectionKey>) {
  const { control, getValues, resetField } = useFormContext<TFieldValues>()
  const allRules = useMemo(() => flattenRules(sections), [sections])

  // Подписываемся на поля из conditions/exceptions
  const fieldsToWatch = useMemo(() => {
    const set = new Set<string>()
    for (const r of allRules) {
      if (r.conditions) Object.keys(r.conditions).forEach((f) => set.add(f))
      if (r.exceptions) Object.keys(r.exceptions).forEach((f) => set.add(f))
    }
    return Array.from(set) as FieldPath<TFieldValues>[]
  }, [allRules])

  const tick = useWatch({ control, name: fieldsToWatch as any })

  const prevRef = useRef<ActiveRulesState<any>>({})
  const activeRules = useMemo<ActiveRulesState<any>>(() => {
    const values = getValues()
    const next: ActiveRulesState<any> = {}
    for (const r of allRules) next[r.id] = checkConditions(values, r)

    const prev = prevRef.current
    let changed = Object.keys(prev).length !== Object.keys(next).length
    if (!changed)
      for (const k in next)
        if (prev[k] !== next[k]) {
          changed = true
          break
        }
    if (!changed) return prev
    prevRef.current = next
    return next
  }, [tick, allRules, getValues])

  // При деактивации правила: сбрасываем поля только если этот ключ не нужен никаким другим активным правилам
  const prevResetRef = useRef<ActiveRulesState<any>>({})
  useEffect(() => {
    logger.debug('[DynamicFields] activeRules changed', activeRules)
    const prev = prevResetRef.current

    // Собираем ключи, которые нужны текущим активным правилам
    const keysRequiredByActive = new Set<string>()
    for (const r of allRules) {
      if (!activeRules[r.id]) continue
      const keys = Object.keys((r as any).schema?.shape ?? {})
      keys.forEach((k) => keysRequiredByActive.add(k))
    }

    for (const r of allRules) {
      const was = prev[r.id]
      const now = activeRules[r.id]
      if (was && !now) {
        const fields = Object.keys((r as any).schema?.shape ?? {}) as FieldPath<TFieldValues>[]
        fields.forEach((name) => {
          // Если ключ больше никем не требуется — очищаем значение и ошибку (keepError=false)
          if (!keysRequiredByActive.has(String(name))) {
            resetField(name, { keepError: false, keepDirty: false, keepTouched: false })
          }
        })
      }
    }
    prevResetRef.current = activeRules
  }, [activeRules, allRules, resetField])

  const meta = useMemo(
    () => ({ sections, options, responseData }) as DynamicMeta<TOptions, TResponseData, SectionKey>,
    [sections, options, responseData],
  )

  return (
    <DynamicMetaContext.Provider value={meta}>
      <ActiveRulesContext.Provider value={activeRules}>{children}</ActiveRulesContext.Provider>
    </DynamicMetaContext.Provider>
  )
})

export function useActiveRules() {
  const v = useContext(ActiveRulesContext)
  if (!v) throw new Error('useActiveRules must be used within a DynamicFieldsProvider')
  return v
}

export function useDynamicMeta<
  TOptions extends object = Record<string, never>,
  TResponseData = unknown,
  SectionKey extends string = string,
>() {
  const v = useContext(DynamicMetaContext)
  if (!v) throw new Error('useDynamicMeta must be used within a DynamicFieldsProvider')
  return v as DynamicMeta<TOptions, TResponseData, SectionKey>
}
