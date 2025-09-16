import { Fragment, useMemo, type ReactNode } from 'react'
import {
  useActiveRules,
  useDynamicMeta,
} from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'

interface DynamicFieldAreaProps {
  section: string
  /** Если true — показываем неактивные правила в disabled-состоянии */
  showInactive?: boolean
  /** Кастомный текст/узел для неактивного состояния */
  inactiveHint?: ReactNode
}

/** Вспомогательная обёртка: делает контент недоступным для интеракции и визуально “выключенным” */
function InactiveWrapper({ children, hint }: { children: React.ReactNode; hint?: ReactNode }) {
  return (
    <fieldset disabled aria-disabled="true" className="pointer-events-none relative select-none">
      {hint ? <p className="text-layout pb-2">{hint}</p> : null}
      <div className="opacity-50">{children}</div>
    </fieldset>
  )
}

export function DynamicFieldArea({
  section,
  showInactive = false,
  inactiveHint,
}: DynamicFieldAreaProps) {
  const active = useActiveRules()
  const { sections } = useDynamicMeta()

  const rules = useMemo(() => sections[section] ?? [], [sections, section])

  return (
    <>
      {rules.map((rule) => {
        const { Component, id } = rule
        const isActive = Boolean(active[id])

        if (isActive) {
          return (
            <Fragment key={id}>
              <Component />
            </Fragment>
          )
        }

        if (!showInactive) return null

        return (
          <InactiveWrapper key={id} hint={inactiveHint}>
            <Component />
          </InactiveWrapper>
        )
      })}
    </>
  )
}
