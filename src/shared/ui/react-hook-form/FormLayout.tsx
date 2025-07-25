import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Используем ComponentProps<'form'>, чтобы компонент принимал все стандартные
 * атрибуты тега <form>, например, onSubmit.
 */
type FormLayoutProps = ComponentProps<'form'> & {
  children: ReactNode
}

export function FormLayout({ children, className, ...props }: FormLayoutProps) {
  return (
    <form className={cn('mx-auto max-w-2xl space-y-3', className)} {...props}>
      {children}
    </form>
  )
}
