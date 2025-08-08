import type { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'

type AdaptiveInputProps = ComponentPropsWithoutRef<'input'>

export function AdaptiveInput({ value, className, ...props }: AdaptiveInputProps) {
  return (
    <div className="relative">
      <span
        className="invisible px-1 whitespace-nowrap"
        style={{ minWidth: '2ch' }}
        aria-hidden="true"
      >
        {value}
      </span>

      <input
        value={value}
        type="number"
        className={clsx(
          'absolute inset-0 h-full w-full border-0 bg-transparent text-center focus:ring-0 focus:outline-none',
          className,
        )}
        {...props}
      />
    </div>
  )
}
