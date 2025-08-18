import { createContext, memo, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFormContext, useWatch, type FieldPath, type FieldValues } from 'react-hook-form'
import { checkConditions, type DynamicFieldConfig } from '@/shared/lib/zod/dynamic-schema'

type ActiveRulesState<RuleKey extends string = string> = Record<RuleKey, boolean>

interface DynamicFieldsContextValue<
  TOptions extends object,
  TResponseData,
  RuleKey extends string,
> {
  config: DynamicFieldConfig<RuleKey>
  options?: TOptions
  responseData?: TResponseData
  activeRules: ActiveRulesState<RuleKey>
}

const DynamicFieldsContext = createContext<DynamicFieldsContextValue<any, any, any> | null>(null)

interface DynamicFieldsProviderProps<
  TOptions extends object,
  TResponseData,
  RuleKey extends string = string,
> {
  config: DynamicFieldConfig<RuleKey>
  options?: TOptions
  responseData?: TResponseData
  children: ReactNode
}

export const DynamicFieldsProvider = memo(function DynamicFieldsProvider<
  TFieldValues extends FieldValues,
  TOptions extends object,
  TResponseData,
  RuleKey extends string = string,
>({
  children,
  config,
  options,
  responseData,
}: DynamicFieldsProviderProps<TOptions, TResponseData, RuleKey>) {
  const { control, getValues, resetField, clearErrors } = useFormContext<TFieldValues>()

  // Поля-триггеры из config
  const fieldsToWatch = useMemo(() => {
    const fieldSet = new Set<string>()
    for (const rule of config) {
      if (rule.conditions) for (const f of Object.keys(rule.conditions)) fieldSet.add(f)
      if (rule.exceptions) for (const f of Object.keys(rule.exceptions)) fieldSet.add(f)
    }
    return Array.from(fieldSet) as FieldPath<TFieldValues>[]
  }, [config])

  // ❗ КЛЮЧЕВАЯ ПРАВКА: не передаём undefined -> иначе подписка на весь form state
  // Пустой массив безопасен: RHF не будет ни на что подписываться.
  const watchedTick = useWatch({
    control,
    name: fieldsToWatch as any, // пустой массив = нет подписки
  })

  // Сохраняем предыдущие activeRules, чтобы не плодить новую ссылку без фактических изменений
  const prevActiveRef = useRef<ActiveRulesState<RuleKey>>({} as ActiveRulesState<RuleKey>)

  const activeRules = useMemo<ActiveRulesState<RuleKey>>(() => {
    const values = getValues()
    const next: ActiveRulesState<RuleKey> = {} as any
    for (const rule of config) {
      next[rule.id as RuleKey] = checkConditions(values, rule)
    }

    // shallow equal: если флаги не изменились, возвращаем прошлую ссылку
    const prev = prevActiveRef.current
    let changed = false
    if (Object.keys(prev).length !== Object.keys(next).length) {
      changed = true
    } else {
      for (const k in next) {
        if (prev[k as keyof typeof prev] !== next[k as keyof typeof next]) {
          changed = true
          break
        }
      }
    }
    if (!changed) return prev

    prevActiveRef.current = next
    return next
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTick, config])

  // Сброс полей и ошибок при деактивации правил
  const prevForResetRef = useRef<ActiveRulesState<RuleKey>>({} as ActiveRulesState<RuleKey>)
  useEffect(() => {
    const prev = prevForResetRef.current
    for (const rule of config) {
      const key = rule.id as RuleKey
      const was = prev[key]
      const now = activeRules[key]

      if (was && !now) {
        const fields = Object.keys((rule as any).schema?.shape ?? {}) as FieldPath<TFieldValues>[]
        if (fields.length) {
          fields.forEach((name) => resetField(name))
          clearErrors(fields)
        }
      }
    }
    prevForResetRef.current = activeRules
  }, [activeRules, clearErrors, config, resetField])

  const contextValue = useMemo(
    () =>
      ({
        config,
        options,
        responseData,
        activeRules, // ссылка теперь стабильнее, если флаги не изменились
      }) as DynamicFieldsContextValue<TOptions, TResponseData, RuleKey>,
    [activeRules, config, options, responseData],
  )

  return (
    <DynamicFieldsContext.Provider value={contextValue}>{children}</DynamicFieldsContext.Provider>
  )
})

export function useDynamicFields<
  TOptions extends object = Record<string, never>,
  TResponseData = unknown,
  RuleKey extends string = string,
>() {
  const ctx = useContext(DynamicFieldsContext)
  if (!ctx) {
    throw new Error('useDynamicFields must be used within a DynamicFieldsProvider')
  }
  return ctx as DynamicFieldsContextValue<TOptions, TResponseData, RuleKey>
}
