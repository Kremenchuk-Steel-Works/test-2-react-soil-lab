import { useEffect } from 'react'
import {
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormResetField,
} from 'react-hook-form'
import { usePrevious } from '@/shared/hooks/usePrevious'
import { checkConditions, type DynamicFieldConfig } from '@/shared/lib/zod'

interface UseDynamicFieldManagerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  config: DynamicFieldConfig
}

export function useDynamicFieldManager<TFieldValues extends FieldValues>({
  control,
  resetField,
  config,
}: UseDynamicFieldManagerProps<TFieldValues>) {
  const formValues = useWatch({ control })
  const prevFormValues = usePrevious(formValues)

  useEffect(() => {
    if (!prevFormValues) return

    // Проверяем каждое правило
    config.forEach((rule) => {
      const wasActive = checkConditions(prevFormValues, rule)
      const isActive = checkConditions(formValues, rule)

      // Если правило было активно, а теперь нет - сбрасываем его поля
      if (wasActive && !isActive) {
        const fieldsToReset = Object.keys(rule.schema.shape) as FieldPath<TFieldValues>[]
        fieldsToReset.forEach((fieldName) => {
          resetField(fieldName)
        })
      }
    })
  }, [formValues, prevFormValues, config, resetField])
}
