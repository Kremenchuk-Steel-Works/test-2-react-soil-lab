import { useMemo } from 'react'
import {
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormGetValues,
} from 'react-hook-form'
import { checkConditions, type DynamicFieldConfig } from '@/shared/lib/zod'

interface UseDynamicFieldManagerProps<TFieldValues extends FieldValues, TOptions extends object> {
  control: Control<TFieldValues>
  getValues: UseFormGetValues<TFieldValues>
  config: DynamicFieldConfig<TOptions>
}

type ActiveRulesState = Record<string, boolean>

export function useDynamicFieldsManager<TFieldValues extends FieldValues, TOptions extends object>({
  control,
  getValues,
  config,
}: UseDynamicFieldManagerProps<TFieldValues, TOptions>): ActiveRulesState {
  const fieldsToWatch = useMemo(() => {
    const fieldSet = new Set<string>()
    config.forEach((rule) => {
      if (rule.conditions) Object.keys(rule.conditions).forEach((field) => fieldSet.add(field))
      if (rule.exceptions) Object.keys(rule.exceptions).forEach((field) => fieldSet.add(field))
    })
    return Array.from(fieldSet) as FieldPath<TFieldValues>[]
  }, [config])

  const watchedValues = useWatch({ control, name: fieldsToWatch })

  const activeRules = useMemo(() => {
    const formValues = getValues()
    const newActiveState: ActiveRulesState = {}
    config.forEach((rule, index) => {
      const ruleKey = String(index)
      newActiveState[ruleKey] = checkConditions(formValues, rule)
    })
    return newActiveState
  }, [watchedValues, config, getValues])

  return activeRules
}
