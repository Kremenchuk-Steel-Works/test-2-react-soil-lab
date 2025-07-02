import { components, type ControlProps, type GroupBase } from 'react-select'
import { twMerge } from 'tailwind-merge'
import type { Option } from './ReactSelect'

export const FloatingLabelControl = <
  OptionType extends Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  children,
  ...props
}: ControlProps<OptionType, IsMulti, Group>) => {
  const { isFocused, hasValue, selectProps } = props
  const inputValue = selectProps.inputValue
  const isFloating = hasValue || isFocused || (inputValue && inputValue.length > 0)

  const placeholderClasses = twMerge(
    'pointer-events-none absolute left-4 transition-all duration-200 ease-in-out',
    'text-gray-400 dark:text-gray-400',
    isFloating ? 'top-1 bg-white dark:bg-gray-700 text-sm' : 'top-1/2 -translate-y-1/2 text-base',
    isFocused && isFloating && 'text-blue-500 dark:text-blue-500',
  )

  return (
    <components.Control {...props}>
      <span className={placeholderClasses}>{selectProps.placeholder}</span>
      {children}
    </components.Control>
  )
}
