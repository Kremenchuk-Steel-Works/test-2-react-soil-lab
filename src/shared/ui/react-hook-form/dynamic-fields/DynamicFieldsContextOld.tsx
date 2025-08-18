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
import { type DynamicFieldConfig } from '@/shared/lib/zod/dynamic-schemaOld'

export interface DynamicFieldsProps {
  control: Control<any>
  errors: FieldErrors<any>
}

type ActiveRulesState = Record<string, boolean>

interface DynamicFieldsContextValue<TOptions extends object, TResponseData> {
  config: DynamicFieldConfig
  options: TOptions
  responseData?: TResponseData
  activeRules: ActiveRulesState
}

const DynamicFieldsContext = createContext<DynamicFieldsContextValue<any, any> | null>(null)

interface DynamicFieldsProviderProps<
  TFieldValues extends FieldValues,
  TOptions extends object,
  TResponseData,
> {
  control: Control<TFieldValues>
  getValues: UseFormGetValues<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  config: DynamicFieldConfig
  options?: TOptions
  responseData?: TResponseData
  children: ReactNode
}

export function DynamicFieldsProvider<
  TFieldValues extends FieldValues,
  TOptions extends object,
  TResponseData,
>({
  children,
  control,
  getValues,
  resetField,
  config,
  options,
  responseData,
}: DynamicFieldsProviderProps<TFieldValues, TOptions, TResponseData>) {
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
      config,
      options,
      responseData,
      activeRules,
    }),
    [config, options, responseData, activeRules],
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
