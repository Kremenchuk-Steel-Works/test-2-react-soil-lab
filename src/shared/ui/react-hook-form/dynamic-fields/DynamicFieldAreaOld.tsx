import { Fragment } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { useDynamicFields } from './DynamicFieldsContextOld'

interface DynamicFieldAreaProps<TFieldValues extends FieldValues> {
  triggerFor: Path<TFieldValues>
}

export function DynamicFieldArea<TFieldValues extends FieldValues>({
  triggerFor,
}: DynamicFieldAreaProps<TFieldValues>) {
  // Получаем все необходимое из контекста одним хуком
  const { config, activeRules, options, responseData } = useDynamicFields<
    TFieldValues,
    FieldValues
  >()

  return (
    <>
      {config.map((rule, index) => {
        const ruleKey = String(index)
        const isRuleActive = activeRules[ruleKey]

        // Проверяем, что правило активно и относится к нашему триггеру
        if (!isRuleActive) {
          return null
        }

        const conditionKeys = Object.keys(rule.conditions)
        const isRelevantToTrigger =
          (rule.renderTrigger && rule.renderTrigger === triggerFor) ||
          (!rule.renderTrigger && conditionKeys.length === 1 && conditionKeys[0] === triggerFor)

        if (!isRelevantToTrigger) {
          return null
        }

        const { Component } = rule
        return (
          <Fragment key={ruleKey}>
            <Component options={options} responseData={responseData} />
          </Fragment>
        )
      })}
    </>
  )
}
