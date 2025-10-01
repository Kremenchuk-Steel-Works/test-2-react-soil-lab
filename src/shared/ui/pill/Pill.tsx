import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle, Circle, XCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export type PillVariant = 'success' | 'warning' | 'error' | 'neutral'
export type PillSize = 'xs' | 'sm' | 'md'

export type PillProps = {
  children: ReactNode
  variant?: PillVariant
  size?: PillSize
  icon?: ReactNode | false
  className?: string
  inline?: boolean
}

const sizeCls: Record<PillSize, string> = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-1.5 py-1 text-sm',
  md: 'px-2 py-1.5 text-base',
}

const iconSizeCls: Record<PillSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
}

const variantCls: Record<PillVariant, string> = {
  success:
    'bg-green-50 text-green-700 border border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-700',
  warning:
    'bg-yellow-50 text-yellow-800 border border-yellow-400/70 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-600',
  error:
    'bg-red-50 text-red-700 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-700',
  neutral:
    'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
}

function defaultIcon(variant: PillVariant, size: PillSize): ReactNode {
  const cls = `${iconSizeCls[size]} shrink-0`
  const sw = 1.6
  switch (variant) {
    case 'success':
      return <CheckCircle className={cls} strokeWidth={sw} />
    case 'warning':
      return <AlertTriangle className={cls} strokeWidth={sw} />
    case 'error':
      return <XCircle className={cls} strokeWidth={sw} />
    default:
      return <Circle className={cls} strokeWidth={sw} />
  }
}

export function Pill({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className,
  inline = true,
}: PillProps) {
  const display = inline ? 'inline-flex' : 'flex'
  const renderedIcon = icon === undefined ? defaultIcon(variant, size) : icon || null

  const base = [
    display,
    'items-center gap-1.5 rounded-full align-middle leading-none',
    'font-normal',
    sizeCls[size],
    variantCls[variant],
  ].join(' ')

  return (
    <span className={twMerge(base, className)}>
      {renderedIcon}
      <span className="leading-none">{children}</span>
    </span>
  )
}
