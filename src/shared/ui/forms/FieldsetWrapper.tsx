import type { ReactNode } from 'react'

interface FieldsetWrapperProps {
  title?: string
  children: ReactNode
  className?: string
}

/**
 * Визуальная обертка для группировки полей формы в единый блок (филдсет).
 * Создает рамку, фон и добавляет заголовок.
 */
export function FieldsetWrapper({ title, children, className }: FieldsetWrapperProps) {
  return (
    <div
      className={`space-y-3 rounded-md border border-gray-200 bg-gray-50 px-4 pb-3 dark:border-gray-900/20 dark:bg-gray-950/10 ${className ?? ''} `}
    >
      {title && <h5 className="layout-text font-semibold">{title}</h5>}
      {children}
    </div>
  )
}
