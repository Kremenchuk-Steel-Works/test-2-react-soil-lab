import React, { forwardRef, useId } from "react"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

const switchColors = ["blue", "red", "orange", "green"] as const
export type SwitchColor = (typeof switchColors)[number]

const getSwitchColorStyles = (color: SwitchColor) => {
  switch (color) {
    case "blue":
      return "bg-blue-600 hover:bg-blue-700"
    case "red":
      return "bg-red-600 hover:bg-red-700"
    case "orange":
      return "bg-orange-500 hover:bg-orange-600"
    case "green":
      return "bg-green-600 hover:bg-green-700"
    default:
      const exhaustiveCheck: never = color
      return exhaustiveCheck
  }
}

const cn = (
  ...inputs: (string | boolean | undefined | Record<string, any>)[]
) => {
  return twMerge(clsx(inputs))
}

export type SwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  customColor?: SwitchColor
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      label,
      checked,
      onChange,
      className,
      disabled,
      customColor = "blue",
      ...props
    },
    ref
  ) => {
    const id = useId()
    const colorClasses = getSwitchColorStyles(customColor)

    return (
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center space-x-3 select-none",
          { "cursor-not-allowed": !!disabled }
        )}
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
            "cursor-pointer relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            // Для цвета фокуса
            `focus-visible:ring-${customColor}-500 dark:focus-visible:ring-offset-gray-800`,
            {
              [colorClasses]: checked,
              "bg-gray-200 dark:bg-gray-700": !checked,
              "opacity-50 cursor-not-allowed": !!disabled,
            },
            className
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              {
                "translate-x-5": checked,
                "translate-x-0": !checked,
              }
            )}
          />
        </button>
        <span
          className={cn("text-gray-900 dark:text-gray-100", {
            "opacity-50": !!disabled,
          })}
        >
          {label}
        </span>
      </label>
    )
  }
)

export default Switch
