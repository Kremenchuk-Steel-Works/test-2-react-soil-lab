import { Fragment, memo, useMemo } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { useDynamicFields } from './DynamicFieldsContext'

const RuleRenderer = memo(function RuleRenderer({
  Component,
  options,
  responseData,
}: {
  Component: React.ComponentType<any>
  options: any
  responseData: any
}) {
  return <Component options={options} responseData={responseData} />
})

interface DynamicFieldAreaProps<TFieldValues extends FieldValues> {
  triggerFor: Path<TFieldValues>
}

export function DynamicFieldArea<TFieldValues extends FieldValues>({
  triggerFor,
}: DynamicFieldAreaProps<TFieldValues>) {
  const { config, activeRules, options, responseData } = useDynamicFields()

  const rulesForTrigger = useMemo(
    () =>
      config.filter((rule) => {
        const conditionKeys = Object.keys(rule.conditions)
        const isRelevant =
          (rule.renderTrigger && rule.renderTrigger === triggerFor) ||
          (!rule.renderTrigger && conditionKeys.length === 1 && conditionKeys[0] === triggerFor)
        return isRelevant
      }),
    [config, triggerFor],
  )

  return (
    <>
      {rulesForTrigger.map((rule) => {
        const id = rule.id
        if (!activeRules[id]) return null
        return (
          <Fragment key={id}>
            <RuleRenderer
              Component={rule.Component}
              options={options}
              responseData={responseData}
            />
          </Fragment>
        )
      })}
    </>
  )
}
