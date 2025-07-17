import { useEffect, useMemo } from 'react'
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
import type { Option } from '@/shared/ui/select/ReactSelect'

/**
 * Правило, которое определяет, какой набор опций и placeholder'а
 * будет активен при выполнении условий.
 */
export interface OptionsRule {
  conditions: ConditionsMap
  exceptions?: ConditionsMap
  options: Option<string>[]
  placeholder?: string
}

/**
 * Конфигурация для одного зависимого поля.
 */
export interface DependentFieldConfig {
  rules: OptionsRule[]
  defaultOptions?: Option<string>[]
  defaultPlaceholder?: string
  resetOnChanges?: boolean
  disableWhenUnmet?: boolean
}

/**
 * Глобальный конфиг для всех зависимых полей формы.
 */
export type DependentOptionsConfig<TFieldValues extends FieldValues> = {
  [K in Path<TFieldValues>]?: DependentFieldConfig
}

interface UseDependentOptionsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  dependentFieldName: Path<TFieldValues>
  config: DependentOptionsConfig<TFieldValues>
}

interface UseDependentOptionsReturn {
  options: Option<string>[]
  isDisabled: boolean
  placeholder?: string
}

export function useDependentOptions<TFieldValues extends FieldValues>({
  control,
  resetField,
  dependentFieldName,
  config,
}: UseDependentOptionsProps<TFieldValues>): UseDependentOptionsReturn {
  const fieldConfig = config[dependentFieldName]

  if (!fieldConfig) {
    logger.warn(`Конфігурація для поля "${dependentFieldName}" не знайдена.`)
    return { options: [], isDisabled: true, placeholder: 'Конфігурація відсутня' }
  }

  const {
    rules,
    defaultOptions = [],
    defaultPlaceholder,
    resetOnChanges = true,
    disableWhenUnmet = true,
  } = fieldConfig

  // Собираем все поля, от которых зависят правила для данного поля, чтобы следить только за ними.
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

  // Следим за изменениями всех нужных полей
  const watchedValues = useWatch({ control, name: triggerFieldNames })

  // Создаем актуальный объект со значениями для проверки
  const currentValues = useMemo(() => {
    return triggerFieldNames.reduce<FieldValues>((acc, key, index) => {
      acc[key] = watchedValues[index]
      return acc
    }, {})
  }, [triggerFieldNames, watchedValues])

  // Вычисляем активное правило
  const activeState = useMemo(() => {
    const activeRule = rules.find(
      (rule) =>
        areConditionsMet(rule.conditions, currentValues) &&
        (!rule.exceptions || !areConditionsMet(rule.exceptions, currentValues)),
    )

    if (activeRule) {
      return {
        options: activeRule.options,
        placeholder: activeRule.placeholder ?? defaultPlaceholder,
        isMet: true,
      }
    }

    // Если ни одно правило не подошло, используем значения по умолчанию
    return {
      options: defaultOptions,
      placeholder: defaultPlaceholder,
      isMet: false,
    }
  }, [rules, currentValues, defaultOptions, defaultPlaceholder])

  // Сбрасываем значение зависимого поля при изменении триггеров
  useEffect(() => {
    if (resetOnChanges) {
      resetField(dependentFieldName)
    }
  }, [watchedValues, resetOnChanges, resetField, dependentFieldName])

  const isDisabled = disableWhenUnmet ? !activeState.isMet : false

  return {
    options: activeState.options,
    placeholder: activeState.placeholder,
    isDisabled,
  }
}
