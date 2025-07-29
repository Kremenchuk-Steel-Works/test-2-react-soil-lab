import type { ReactNode } from 'react'
import clsx from 'clsx'

interface FieldsetWrapperProps {
  title?: string
  button?: ReactNode
  children: ReactNode
  className?: string
}

export function FieldsetWrapper({ title, button, children, className }: FieldsetWrapperProps) {
  return (
    <div
      className={clsx(
        'space-y-3 rounded-lg bg-gray-200 px-4 py-3 pb-4 dark:bg-gray-950/20',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {title && (
          <h5 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
            {title}
          </h5>
        )}
        {button}
      </div>
      {children}
    </div>
  )
}
