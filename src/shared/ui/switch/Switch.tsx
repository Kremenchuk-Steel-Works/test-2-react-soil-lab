import { forwardRef, useId, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type SwitchColor = 'blue' | 'red' | 'orange' | 'green'

const COLOR_STYLES = {
  blue: { bg: 'bg-blue-600 hover:bg-blue-700', focus: 'focus-visible:ring-blue-500' },
  red: { bg: 'bg-red-600 hover:bg-red-700', focus: 'focus-visible:ring-red-500' },
  orange: { bg: 'bg-orange-500 hover:bg-orange-600', focus: 'focus-visible:ring-orange-500' },
  green: { bg: 'bg-green-600 hover:bg-green-700', focus: 'focus-visible:ring-green-500' },
} satisfies Record<SwitchColor, { bg: string; focus: string }>

export type SwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  customColor?: SwitchColor
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, checked, onChange, className, disabled, customColor = 'blue', ...props }, ref) => {
    const id = useId()
    const { bg, focus } = COLOR_STYLES[customColor]

    return (
      <label
        htmlFor={id}
        className={cn('flex items-center space-x-3 select-none', {
          'cursor-not-allowed': !!disabled,
          'cursor-pointer': !disabled,
        })}
      >
        <button
          ref={ref}
          id={id}
          role="switch"
          type="button"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
            focus,
            {
              [bg]: checked,
              'bg-gray-200 dark:bg-gray-700': !checked,
              'cursor-not-allowed opacity-50': !!disabled,
            },
            className,
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </button>

        <span className={cn('text-gray-900 dark:text-gray-100', { 'opacity-50': !!disabled })}>
          {label}
        </span>
      </label>
    )
  },
)

Switch.displayName = 'Switch'

export default Switch
