import { ChevronDown, X } from "lucide-react"
import type { JSX } from "react"
import Select, {
  type GroupBase,
  type Props as SelectProps,
  type StylesConfig,
} from "react-select"
import {
  components,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
} from "react-select"
import { twMerge } from "tailwind-merge"

export type Option = {
  value: string | number | boolean | undefined
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
  multiValue: () => string
  multiValueLabel: () => string
  multiValueRemove: () => string
}>

interface ReactSelectProps<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
> extends SelectProps<OptionType, IsMulti, Group> {
  customClassNames?: ClassNamesConfig
  customStyles?: StylesConfig<OptionType, IsMulti, Group>
}

function ReactSelect<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  customClassNames = {},
  customStyles = {},
  ...props
}: ReactSelectProps<OptionType, IsMulti, Group>): JSX.Element {
  return (
    <Select<OptionType, IsMulti, Group>
      {...props}
      noOptionsMessage={() => "Нічого не знайдено"}
      styles={customStyles}
      unstyled
      components={{
        ...props.components,
        IndicatorSeparator: () => (
          <span className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1.5" />
        ),
        ClearIndicator: (
          indicatorProps: ClearIndicatorProps<OptionType, IsMulti, Group>
        ) => (
          <components.ClearIndicator {...indicatorProps}>
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors" />
          </components.ClearIndicator>
        ),
        DropdownIndicator: (
          dropdownProps: DropdownIndicatorProps<OptionType, IsMulti, Group>
        ) => (
          <components.DropdownIndicator {...dropdownProps}>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-300 ${
                dropdownProps.selectProps.menuIsOpen
                  ? "-rotate-180"
                  : "rotate-0"
              }`}
            />
          </components.DropdownIndicator>
        ),
      }}
      classNames={{
        control: (props) =>
          twMerge(
            baseClassNames.control?.(props),
            customClassNames.control?.(props)
          ),
        input: () =>
          twMerge(baseClassNames.input?.(), customClassNames.input?.()),
        placeholder: () =>
          twMerge(
            baseClassNames.placeholder?.(),
            customClassNames.placeholder?.()
          ),
        option: (props) =>
          twMerge(
            baseClassNames.option?.(props),
            customClassNames.option?.(props)
          ),
        menu: () => twMerge(baseClassNames.menu?.(), customClassNames.menu?.()),
        multiValue: () =>
          twMerge(
            baseClassNames.multiValue?.(),
            customClassNames.multiValue?.()
          ),
        multiValueLabel: () =>
          twMerge(
            baseClassNames.multiValueLabel?.(),
            customClassNames.multiValueLabel?.()
          ),
        multiValueRemove: () =>
          twMerge(
            baseClassNames.multiValueRemove?.(),
            customClassNames.multiValueRemove?.()
          ),
      }}
    />
  )
}

const baseClassNames: ClassNamesConfig = {
  control: ({ isFocused }) =>
    twMerge(
      "border rounded-md px-4 py-3.5 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600",
      isFocused && "ring-2 ring-blue-500"
    ),
  placeholder: () => "text-gray-400 dark:text-gray-400",
  input: () => "text-black dark:text-white",
  option: ({ isFocused, isSelected }) =>
    twMerge(
      "px-3 py-2 cursor-pointer",
      isSelected && "bg-blue-500 text-white",
      !isSelected && isFocused && "bg-gray-200 dark:bg-gray-600",
      !isSelected &&
        !isFocused &&
        "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
    ),
  menu: () =>
    "mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 shadow-lg",
  multiValue: () =>
    twMerge(
      "bg-gray-200 dark:bg-gray-600 rounded pl-2 mx-0.5 my-0.5 py-1 flex items-center",
      "text-gray-700 dark:text-gray-300"
    ),
  multiValueLabel: () => "",
  multiValueRemove: () =>
    twMerge(
      "ml-1 p-1 px-1 cursor-pointer rounded-md",
      "text-gray-400 dark:text-gray-400",
      "hover:bg-red-200 dark:hover:bg-red-800",
      "hover:text-red-800 dark:hover:text-red-300",
      "transition-colors duration-200"
    ),
}

export default ReactSelect
