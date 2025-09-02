import { ChevronDown } from 'lucide-react'
import { components, type DropdownIndicatorProps } from 'react-select'
import { twMerge } from 'tailwind-merge'
import type { Option } from '@/shared/ui/select/ReactSelect'

/**
 * @description Кастомный индикатор, который отображает либо спиннер загрузки, либо стрелку.
 * Это решает проблему смещения контента, так как оба состояния рендерятся в одном и том же месте.
 */
export const CustomDropdownIndicator = <OptionType extends Option, IsMulti extends boolean>(
  props: DropdownIndicatorProps<OptionType, IsMulti>,
) => {
  const {
    selectProps: { isLoading },
  } = props

  if (isLoading) {
    return (
      <div className="mx-[2px] h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
    )
  }

  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown
        className={twMerge(
          'h-5 w-5 text-gray-600 transition-all duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
          props.selectProps.menuIsOpen ? '-rotate-180' : 'rotate-0',
        )}
      />
    </components.DropdownIndicator>
  )
}
