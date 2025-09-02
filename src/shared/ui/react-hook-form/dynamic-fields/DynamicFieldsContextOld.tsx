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

export interface DynamicFieldsProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  errors: FieldErrors<TFieldValues>
}

type ActiveRulesState = Record<string, boolean>

interface DynamicFieldsContextValue<TOptions extends object, TResponseData> {
  config: DynamicFieldConfig
  options: TOptions
  responseData?: TResponseData
  activeRules: ActiveRulesState
}

const DynamicFieldsContext = createContext<DynamicFieldsContextValue<object, unknown> | null>(null)

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
        // Безопасно приводим shape к записи, чтобы убрать no-unsafe-argument
        const shape = (rule.schema as { shape: Record<string, unknown> }).shape
        const fieldsToReset = Object.keys(shape) as FieldPath<TFieldValues>[]
        fieldsToReset.forEach((fieldName) => resetField(fieldName))
      }
    })

    prevActiveRulesRef.current = activeRules
  }, [activeRules, config, resetField])

  const normalizedOptions = useMemo(() => options ?? ({} as TOptions), [options])

  // Собираем значение для провайдера и передаем его дочерним компонентам
  const contextValue = useMemo(
    () => ({
      config,
      options: normalizedOptions,
      responseData,
      activeRules,
    }),
    [config, normalizedOptions, responseData, activeRules],
  )

  return (
    <DynamicFieldsContext.Provider value={contextValue}>{children}</DynamicFieldsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDynamicFields<TFieldValues extends FieldValues, TOptions extends object>() {
  const context = useContext(DynamicFieldsContext)
  if (!context) {
    throw new Error('useDynamicFields must be used within a DynamicFieldsProvider')
  }
  return context as DynamicFieldsContextValue<TFieldValues, TOptions>
}
