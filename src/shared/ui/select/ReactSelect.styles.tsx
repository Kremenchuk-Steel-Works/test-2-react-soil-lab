import { ChevronDown, X } from 'lucide-react'
import {
  components,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type OptionProps,
  type ValueContainerProps,
} from 'react-select'
import { twMerge } from 'tailwind-merge'
import type { Option } from '@/shared/ui/select/ReactSelect'

export type ClassNamesConfig = Partial<{
  control: (props: { isFocused: boolean; isDisabled: boolean }) => string
  input: () => string
  placeholder: () => string
  option: (props: OptionProps<any, any, any>) => string
  menu: () => string
  valueContainer: (state: ValueContainerProps<any, any>) => string
  singleValue: () => string
  multiValue: () => string
  multiValueLabel: () => string
  multiValueRemove: () => string
}>

// Объект с базовыми Tailwind-классами
export const baseClassNames: ClassNamesConfig = {
  control: ({ isFocused, isDisabled }) =>
    twMerge(
      'relative border rounded-md px-4 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
      'flex',
      isFocused && 'ring-2 ring-blue-500',
      isDisabled && 'opacity-50',
    ),
  valueContainer: (state) => {
    if (state.isMulti && state.hasValue) {
      return 'pt-6 pb-2 h-full flex flex-wrap items-start flex-grow gap-0.5'
    }
    if (state.isMulti && !state.hasValue) {
      return 'pt-6 pb-2 h-full flex-grow'
    }
    return 'pt-3 h-full flex-grow'
  },
  singleValue: () => '',
  placeholder: () => 'text-transparent',
  input: () => ' my-1',
  option: ({ isFocused, isSelected }) =>
    twMerge(
      'px-3 py-3 cursor-pointer',
      'whitespace-normal break-words',
      isSelected && 'bg-blue-500 text-white',
      !isSelected && isFocused && 'bg-gray-200 dark:bg-gray-600',
      !isSelected && !isFocused && 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    ),
  menu: () =>
    'mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 shadow-lg',
  multiValue: () =>
    twMerge(
      'bg-gray-200 dark:bg-gray-600 rounded pl-2 mx-0.5 my-0.5 flex items-center',
      'text-gray-700 dark:text-gray-300',
    ),
  multiValueLabel: () => 'py-0.5',
  multiValueRemove: () =>
    twMerge(
      'ml-1 p-[5px] cursor-pointer rounded-md',
      'text-gray-400 dark:text-gray-400',
      'hover:bg-red-200 dark:hover:bg-red-800',
      'hover:text-red-800 dark:hover:text-red-300',
      'transition-colors duration-200',
    ),
}

/**
 * @description Кастомный индикатор, который отображает либо спиннер загрузки, либо стрелку.
 * Это решает проблему смещения контента, так как оба состояния рендерятся в одном и том же месте.
 */
const CustomDropdownIndicator = <OptionType extends Option, IsMulti extends boolean>(
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

// Объект с кастомными компонентами для стилизации
export const customComponents = {
  LoadingIndicator: () => null,

  IndicatorSeparator: () => <span className="mx-[3px] h-5 w-px bg-gray-300 dark:bg-gray-600" />,

  ClearIndicator: <OptionType extends Option>(props: ClearIndicatorProps<OptionType, false>) => {
    // Получаем проп isClearable из пропсов всего селекта
    const {
      selectProps: { isClearable },
      hasValue,
    } = props

    // Не рендерим индикатор, если очистка запрещена или нет значения
    if (!isClearable || !hasValue) {
      return null
    }

    // Если всё в порядке, рендерим наш кастомный индикатор
    return (
      <components.ClearIndicator {...props}>
        <X className="h-4 w-4 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" />
      </components.ClearIndicator>
    )
  },

  DropdownIndicator: CustomDropdownIndicator,
}
