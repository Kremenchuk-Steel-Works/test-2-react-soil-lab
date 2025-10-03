import { Children, type ComponentProps, type ReactNode } from 'react'
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
  const hasChildren = Children.toArray(children).some((c) =>
    typeof c === 'string' ? c.trim() !== '' : true,
  )

  if (!hasChildren) return null

  const cls = cn('mx-auto max-w-2xl space-y-3 mb-3 last:mb-0', className)

  if (as === 'div') {
    return <div className={cls}>{children}</div>
  }

  // Ветка <form> (default)
  return (
    <form className={cls} {...props}>
      {children}
    </form>
  )
}
