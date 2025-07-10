// shared/ui/forms/DynamicFieldsRenderer.tsx
import { Fragment } from 'react'
import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form'
import { checkConditions, type DynamicFieldConfig } from '@/shared/lib/zod'

interface DynamicFieldsRendererProps<
  TFieldValues extends FieldValues,
  TTrigger extends Path<TFieldValues>,
> {
  control: Control<TFieldValues>
  config: DynamicFieldConfig
  triggerFor: TTrigger
}

export function DynamicFieldsRenderer<
  TFieldValues extends FieldValues,
  TTrigger extends Path<TFieldValues>,
>({ control, config, triggerFor }: DynamicFieldsRendererProps<TFieldValues, TTrigger>) {
  const formValues = useWatch({ control })

  // Новая, более умная логика фильтрации
  const relevantRules = config.filter((rule) => {
    const conditionKeys = Object.keys(rule.conditions)

    // 1. Если `renderTrigger` задан явно, используем только его.
    if (rule.renderTrigger) {
      return rule.renderTrigger === triggerFor
    }

    // 2. Если `renderTrigger` не задан, и правило простое (1 условие),
    // то оно относится к рендереру своего единственного ключа.
    if (conditionKeys.length === 1) {
      return conditionKeys[0] === triggerFor
    }

    // 3. Во всех остальных случаях (сложное правило без renderTrigger)
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
              <Component control={control} />
            </Fragment>
          )
        }

        return null
      })}
    </>
  )
}
