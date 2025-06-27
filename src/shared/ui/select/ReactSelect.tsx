import { type JSX } from 'react'
import { ChevronDown, X } from 'lucide-react'
import Select, {
  components,
  type ClearIndicatorProps,
  type ControlProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type Props as SelectProps,
  type StylesConfig,
  type ValueContainerProps,
} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { twMerge } from 'tailwind-merge'
import AnimatedMenu from '@/shared/ui/select/AnimatedMenu'

export type Option<ValueType = string | number | boolean> = {
  value: ValueType
  label: string
}

export type ClassNameFunctionParams = {
  isFocused?: boolean
  isSelected?: boolean
}

export type ClassNamesConfig = Partial<{
  control: (params: ClassNameFunctionParams) => string
  input: () => string
  placeholder: () => string
  option: (params: ClassNameFunctionParams) => string
  menu: () => string
  valueContainer: (state: ValueContainerProps<any, boolean>) => string
  singleValue: () => string
  multiValue: () => string
  multiValueLabel: () => string
  multiValueRemove: () => string
}>

interface ReactSelectProps<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> extends SelectProps<OptionType, IsMulti, Group> {
  customClassNames?: ClassNamesConfig
  customStyles?: StylesConfig<OptionType, IsMulti, Group>
  isCreatable?: boolean
}

const FloatingLabelControl = <
  OptionType,
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
    isFloating
      ? 'top-1 text-xs bg-white dark:bg-gray-700 text-sm'
      : 'top-1/2 -translate-y-1/2 text-base',
    isFocused && isFloating && 'text-blue-500 dark:text-blue-500',
  )

  return (
    <components.Control {...props}>
      <span className={placeholderClasses}>{selectProps.placeholder}</span>
      {children}
    </components.Control>
  )
}

function ReactSelect<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  customClassNames = {},
  customStyles = {},
  isCreatable = false,
  ...props
}: ReactSelectProps<OptionType, IsMulti, Group>): JSX.Element {
  const SelectComponent = isCreatable ? CreatableSelect : Select

  return (
    <SelectComponent<OptionType, IsMulti, Group>
      {...props}
      noOptionsMessage={() => 'Нічого не знайдено'}
      formatCreateLabel={(inputValue) => `Додати: "${inputValue}"`}
      unstyled
      styles={{
        ...customStyles,
        control: (base, state) => {
          const custom = customStyles.control ? customStyles.control(base, state) : {}
          return { ...base, ...custom, minHeight: custom.minHeight ?? '54px' }
        },
        valueContainer: (base, state) => {
          const custom = customStyles.valueContainer ? customStyles.valueContainer(base, state) : {}
          return { ...base, ...custom, height: custom.height ?? '100%' }
        },
      }}
      components={{
        ...props.components,
        Menu: AnimatedMenu,
        Control: FloatingLabelControl,
        IndicatorSeparator: () => (
          <span className="mx-[3px] h-5 w-px bg-gray-300 dark:bg-gray-600" />
        ),
        ClearIndicator: (indicatorProps: ClearIndicatorProps<OptionType, IsMulti, Group>) => (
          <components.ClearIndicator {...indicatorProps}>
            <X className="h-4 w-4 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" />
          </components.ClearIndicator>
        ),
        DropdownIndicator: (dropdownProps: DropdownIndicatorProps<OptionType, IsMulti, Group>) => (
          <components.DropdownIndicator {...dropdownProps}>
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition-all duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 ${
                dropdownProps.selectProps.menuIsOpen ? '-rotate-180' : 'rotate-0'
              }`}
            />
          </components.DropdownIndicator>
        ),
      }}
      classNames={{
        control: (props) =>
          twMerge(baseClassNames.control?.(props), customClassNames.control?.(props)),
        input: () => twMerge(baseClassNames.input?.(), customClassNames.input?.()),
        placeholder: () =>
          twMerge(baseClassNames.placeholder?.(), customClassNames.placeholder?.()),
        option: (props) =>
          twMerge(baseClassNames.option?.(props), customClassNames.option?.(props)),
        menu: () => twMerge(baseClassNames.menu?.(), customClassNames.menu?.()),

        valueContainer: (state) =>
          twMerge(baseClassNames.valueContainer?.(state), customClassNames.valueContainer?.(state)),

        singleValue: () =>
          twMerge(baseClassNames.singleValue?.(), customClassNames.singleValue?.()),
        multiValue: () => twMerge(baseClassNames.multiValue?.(), customClassNames.multiValue?.()),
        multiValueLabel: () =>
          twMerge(baseClassNames.multiValueLabel?.(), customClassNames.multiValueLabel?.()),
        multiValueRemove: () =>
          twMerge(baseClassNames.multiValueRemove?.(), customClassNames.multiValueRemove?.()),
      }}
    />
  )
}

const baseClassNames: ClassNamesConfig = {
  control: ({ isFocused }) =>
    twMerge(
      'relative border rounded-md px-4 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
      'flex',
      isFocused && 'ring-2 ring-blue-500',
    ),

  // Условное применение стилей
  valueContainer: (state) => {
    // Для MULTI-селекта, в котором есть значения
    if (state.isMulti && state.hasValue) {
      return 'pt-6 pb-2 h-full flex flex-wrap items-start flex-grow gap-0.5'
    }

    // Для ПУСТОГО MULTI-селекта
    if (state.isMulti && !state.hasValue) {
      return 'pt-6 pb-2 h-full flex-grow'
    }

    // Для SINGLE-селекта
    return 'pt-3 h-full flex-grow'
  },

  singleValue: () => '',
  placeholder: () => 'text-transparent',
  input: () => ' my-1',

  option: ({ isFocused, isSelected }) =>
    twMerge(
      'px-3 py-3 cursor-pointer',
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

export default ReactSelect
