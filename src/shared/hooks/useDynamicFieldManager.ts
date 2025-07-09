import { useEffect } from 'react'
import {
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormResetField,
} from 'react-hook-form'
import { usePrevious } from '@/shared/hooks/usePrevious'
import type { DynamicFieldConfig } from '@/shared/lib/zod'

// Используем Generics, чтобы хук был типизирован под конкретную форму и конфиг
interface UseDynamicFieldManagerProps<
  TFieldValues extends FieldValues,
  TConfig extends DynamicFieldConfig,
> {
  control: Control<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  config: TConfig // Добавляем конфиг как обязательный аргумент
}

export function useDynamicFieldManager<
  TFieldValues extends FieldValues,
  TConfig extends DynamicFieldConfig,
>({ control, resetField, config }: UseDynamicFieldManagerProps<TFieldValues, TConfig>) {
  // Получаем ключи из переданного конфига
  const triggerFieldNames = Object.keys(config) as Array<FieldPath<TFieldValues>>

  const watchedValues = useWatch({ control, name: triggerFieldNames })
  const prevWatchedValues = usePrevious(watchedValues)

  useEffect(() => {
    if (!prevWatchedValues) return

    triggerFieldNames.forEach((triggerName, index) => {
      const currentValue = watchedValues[index]
      const prevValue = prevWatchedValues[index]

      if (currentValue !== prevValue && prevValue) {
        // Ищем правило в переданном конфиге
        const prevRule = config[triggerName as string]?.[prevValue]

        if (prevRule) {
          const fieldsToReset = Object.keys(prevRule.schema.shape)
          fieldsToReset.forEach((fieldName) => {
            resetField(fieldName as FieldPath<TFieldValues>)
          })
        }
      }
    })
  }, [watchedValues, prevWatchedValues, triggerFieldNames, resetField, config])
}
