import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import {
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type UseFormGetValues,
  type UseFormResetField,
} from 'react-hook-form'
import { useDynamicFieldsManager } from '@/shared/hooks/react-hook-form/dynamic-fields/useDynamicFieldsManager'
import { logger } from '@/shared/lib/logger'
import { type DynamicFieldConfig } from '@/shared/lib/zod/dynamic-schema'

export interface DynamicFieldsProps {
  control: Control<any>
  errors: FieldErrors<any>
}

type ActiveRulesState = Record<string, boolean>

interface DynamicFieldsContextValue<TFieldValues extends FieldValues, TOptions extends object> {
  control: Control<TFieldValues>
  errors: FieldErrors<TFieldValues>
  config: DynamicFieldConfig<TOptions>
  options: TOptions
  activeRules: ActiveRulesState
}

const DynamicFieldsContext = createContext<DynamicFieldsContextValue<any, any> | null>(null)

interface DynamicFieldsProviderProps<TFieldValues extends FieldValues, TOptions extends object> {
  control: Control<TFieldValues>
  getValues: UseFormGetValues<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  errors: FieldErrors<TFieldValues>
  config: DynamicFieldConfig<TOptions>
  options: TOptions
  children: ReactNode
}

export function DynamicFieldsProvider<TFieldValues extends FieldValues, TOptions extends object>({
  children,
  control,
  getValues,
  resetField,
  errors,
  config,
  options,
}: DynamicFieldsProviderProps<TFieldValues, TOptions>) {
  // Используем хук для получения состояния
  const activeRules = useDynamicFieldsManager({ control, getValues, config })

  const prevActiveRulesRef = useRef<ActiveRulesState>({})

  useEffect(() => {
    logger.debug('DynamicFieldsProvider: activeRules changed', activeRules)
    const prevActiveRules = prevActiveRulesRef.current

    config.forEach((rule, index) => {
      const ruleKey = String(index)
      const wasActive = prevActiveRules[ruleKey]
      const isActive = activeRules[ruleKey]

      if (wasActive && !isActive) {
        const fieldsToReset = Object.keys(rule.schema.shape) as FieldPath<TFieldValues>[]
        fieldsToReset.forEach((fieldName) => resetField(fieldName))
      }
    })

    prevActiveRulesRef.current = activeRules
  }, [activeRules, config, resetField])

  // Собираем значение для провайдера и передаем его дочерним компонентам
  const contextValue = useMemo(
    () => ({
      control,
      errors,
      config,
      options,
      activeRules,
    }),
    [control, errors, config, options, activeRules],
  )

  return (
    <DynamicFieldsContext.Provider value={contextValue}>{children}</DynamicFieldsContext.Provider>
  )
}

export function useDynamicFields<TFieldValues extends FieldValues, TOptions extends object>() {
  const context = useContext(DynamicFieldsContext)
  if (!context) {
    throw new Error('useDynamicFields must be used within a DynamicFieldsProvider')
  }
  return context as DynamicFieldsContextValue<TFieldValues, TOptions>
}
