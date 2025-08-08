import { useMemo } from 'react'
import {
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormGetValues,
} from 'react-hook-form'
import { checkConditions, type DynamicFieldConfig } from '@/shared/lib/zod/dynamic-schema'

interface UseDynamicFieldManagerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  getValues: UseFormGetValues<TFieldValues>
  config: DynamicFieldConfig
}

type ActiveRulesState = Record<string, boolean>

export function useDynamicFieldsManager<TFieldValues extends FieldValues>({
  control,
  getValues,
  config,
}: UseDynamicFieldManagerProps<TFieldValues>): ActiveRulesState {
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
