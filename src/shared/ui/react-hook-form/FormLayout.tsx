import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Используем ComponentProps<'form'>, чтобы компонент принимал все стандартные
 * атрибуты тега <form>, например, onSubmit.
 */
type FormLayoutProps = ComponentProps<'form'> & {
  as?: 'form' | 'div'
  children: ReactNode
}

export function FormLayout({ children, className, as = 'form', ...props }: FormLayoutProps) {
  const cls = cn('mx-auto max-w-2xl space-y-3 mb-3 last:mb-0', className)
  return as === 'div' ? (
    <div className={cls}>{children}</div>
  ) : (
    <form className={cls} {...props}>
      {children}
    </form>
  )
}
