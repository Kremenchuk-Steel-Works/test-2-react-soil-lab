import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title: string
  className?: string
}

/**
 * Простая обертка для добавления нативного title-tooltip к любому элементу,
 * особенно для иконок или кнопок без текста.
 */
export const TooltipWrapper = ({ children, title, className }: Props) => {
  // Используем `span` по умолчанию, чтобы не ломать flex-контейнеры.
  // Он ведет себя как inline-элемент.
  return (
    <span title={title} className={className}>
      {children}
    </span>
  )
}
