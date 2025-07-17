import { Fragment } from 'react'
import {
  useWatch,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { checkConditions, type DynamicFieldConfig } from '@/shared/lib/zod'

/**
 * Базовые пропсы, которые получает каждый динамический компонент.
 */
export interface DynamicFieldsProps {
  control: Control<any>
  errors: FieldErrors<any>
}

interface DynamicFieldsRendererProps<TFieldValues extends FieldValues, TOptions extends object> {
  control: Control<TFieldValues>
  errors: FieldErrors<TFieldValues>
  config: DynamicFieldConfig<TOptions>
  triggerFor: Path<TFieldValues>
  options: TOptions
}

export function DynamicFieldsRenderer<TFieldValues extends FieldValues, TOptions extends object>({
  control,
  errors,
  config,
  triggerFor,
  options,
}: DynamicFieldsRendererProps<TFieldValues, TOptions>) {
  const formValues = useWatch({ control })

  const relevantRules = config.filter((rule) => {
    const conditionKeys = Object.keys(rule.conditions)

    // Если `renderTrigger` задан явно, используем только его.
    if (rule.renderTrigger) {
      return rule.renderTrigger === triggerFor
    }

    // Если `renderTrigger` не задан, и правило простое (1 условие),
    // то оно относится к рендереру своего единственного ключа.
    if (conditionKeys.length === 1) {
      return conditionKeys[0] === triggerFor
    }

    // Во всех остальных случаях (сложное правило без renderTrigger)
    // считаем его "бездомным", чтобы избежать дублирования.
    return false
  })

  if (relevantRules.length === 0) {
    return null
  }

  return (
    <>
      {relevantRules.map((rule, index) => {
        const isRuleActive = checkConditions(formValues, rule)

        if (isRuleActive) {
          const { Component } = rule
          return (
            <Fragment key={index}>
              <Component control={control} errors={errors} options={options} />
            </Fragment>
          )
        }

        return null
      })}
    </>
  )
}
