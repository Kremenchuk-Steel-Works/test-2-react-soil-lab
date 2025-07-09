import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form'
import type { DynamicFieldConfig } from '@/shared/lib/zod'

interface DynamicFieldsRendererProps<
  TFieldValues extends FieldValues,
  TTrigger extends Path<TFieldValues>,
> {
  control: Control<TFieldValues>
  config: DynamicFieldConfig
  triggerFor: TTrigger
}

/**
 * Компонент для условного рендеринга полей формы в зависимости от значения другого поля.
 *
 * Он отслеживает значение поля, указанного в `triggerFor`. Когда это значение меняется,
 * компонент ищет соответствующее правило в объекте `config` и, если находит,
 * отображает связанный с этим правилом UI-компонент.
 *
 * @param control - Объект `control` из `react-hook-form`.
 * @param config - Объект конфигурации, который связывает значения полей-триггеров с компонентами для рендеринга.
 * @param triggerFor - Имя поля-триггера, за значением которого нужно следить.
 *
 * @example
 * // Внутри формы, если нужно показать разные поля в зависимости от значения поля 'gender'
 * <DynamicFieldsRenderer
 * control={control}
 * triggerFor="gender"
 * config={myDynamicConfig}
 * />
 */
export function DynamicFieldsRenderer<
  TFieldValues extends FieldValues,
  TTrigger extends Path<TFieldValues>,
>({ control, config, triggerFor }: DynamicFieldsRendererProps<TFieldValues, TTrigger>) {
  const triggerValue = useWatch({
    control,
    name: triggerFor,
  })

  if (typeof triggerValue !== 'string' || !triggerValue) {
    return null
  }

  const rule = config[triggerFor]?.[triggerValue]

  if (!rule) {
    return null
  }

  const { Component } = rule
  return <Component control={control} />
}
