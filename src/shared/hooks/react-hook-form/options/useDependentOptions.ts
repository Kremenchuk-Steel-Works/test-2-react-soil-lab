import { useEffect, useMemo, useRef } from 'react'
import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormResetField,
} from 'react-hook-form'
import { logger } from '@/shared/lib/logger'
import {
  areConditionsMet,
  type ConditionsMap,
} from '@/shared/lib/react-hook-form/condition-checker'
import type { Option, SelectOptions } from '@/shared/ui/select/ReactSelect'

export interface OptionsRule<T extends Option> {
  conditions: ConditionsMap
  exceptions?: ConditionsMap
  options: SelectOptions<T>
  placeholder?: string
}

export interface DependentFieldConfig<T extends Option> {
  rules: OptionsRule<T>[]
  defaultOptions?: SelectOptions<T>
  defaultPlaceholder?: string
  resetOnChanges?: boolean
  disableWhenUnmet?: boolean
}

export type DependentOptionsConfig<
  TFieldValues extends FieldValues,
  T extends Option = Option<string>,
> = {
  [K in Path<TFieldValues>]?: DependentFieldConfig<T>
}

interface UseDependentOptionsProps<
  TFieldValues extends FieldValues,
  T extends Option = Option<string>,
> {
  control: Control<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  dependentFieldName: Path<TFieldValues>
  config: DependentOptionsConfig<TFieldValues, T>
}

interface UseDependentOptionsReturn<T extends Option> {
  options: SelectOptions<T>
  isDisabled: boolean
  placeholder?: string
}

export function useDependentOptions<
  TFieldValues extends FieldValues,
  T extends Option = Option<string>,
>({
  control,
  resetField,
  dependentFieldName,
  config,
}: UseDependentOptionsProps<TFieldValues, T>): UseDependentOptionsReturn<T> {
  const fieldConfig = config[dependentFieldName]

  // Логируем отсутствие конфига (не влияет на порядок вызова хуков)
  if (!fieldConfig) {
    logger.warn(`Конфігурація для поля "${dependentFieldName}" не знайдена.`)
  }

  // Нормализуем конфиг, чтобы не делать ранний return
  const normalizedConfig: DependentFieldConfig<T> = fieldConfig ?? {
    rules: [],
    defaultOptions: [],
    defaultPlaceholder: 'Конфігурація відсутня',
    resetOnChanges: true,
    disableWhenUnmet: true,
  }

  const {
    rules,
    defaultOptions = [],
    defaultPlaceholder,
    resetOnChanges = true,
    disableWhenUnmet = true,
  } = normalizedConfig

  const triggerFieldNames = useMemo(() => {
    const fieldSet = new Set<string>()
    rules.forEach((rule) => {
      Object.keys(rule.conditions).forEach((key) => fieldSet.add(key))
      if (rule.exceptions) {
        Object.keys(rule.exceptions).forEach((key) => fieldSet.add(key))
      }
    })
    return Array.from(fieldSet) as Path<TFieldValues>[]
  }, [rules])

  const watchedValues = useWatch({
    control,
    name: triggerFieldNames,
    // Если отслеживать нечего — отключаем подписку
    disabled: triggerFieldNames.length === 0,
  })

  const currentValues = useMemo(() => {
    return triggerFieldNames.reduce<FieldValues>((acc, key, index) => {
      acc[key] = watchedValues[index]
      return acc
    }, {})
  }, [triggerFieldNames, watchedValues])

  const activeRuleIndex = useMemo(() => {
    return rules.findIndex(
      (rule) =>
        areConditionsMet(rule.conditions, currentValues) &&
        (!rule.exceptions || !areConditionsMet(rule.exceptions, currentValues)),
    )
  }, [rules, currentValues])

  const activeState = useMemo(() => {
    if (activeRuleIndex !== -1) {
      const activeRule = rules[activeRuleIndex]
      return {
        options: activeRule.options,
        placeholder: activeRule.placeholder ?? defaultPlaceholder,
        isMet: true,
        activeIndex: activeRuleIndex,
      }
    }

    return {
      options: defaultOptions,
      placeholder: defaultPlaceholder,
      isMet: false,
      activeIndex: -1,
    }
  }, [activeRuleIndex, rules, defaultOptions, defaultPlaceholder])

  const prevActiveStateRef = useRef(activeState)

  useEffect(() => {
    const previousState = prevActiveStateRef.current
    const currentState = activeState

    const hasRuleChanged = previousState.activeIndex !== currentState.activeIndex

    if (resetOnChanges && hasRuleChanged) {
      resetField(dependentFieldName)
    }

    prevActiveStateRef.current = currentState
  }, [activeState, resetOnChanges, resetField, dependentFieldName])

  const isDisabled = disableWhenUnmet ? !activeState.isMet : false

  return {
    options: activeState.options,
    placeholder: activeState.placeholder,
    isDisabled,
  }
}
