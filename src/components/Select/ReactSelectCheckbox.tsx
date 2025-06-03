import { type JSX } from "react"
import { type OptionProps, type StylesConfig } from "react-select"
import ReactSelect, { type ClassNamesConfig } from "./ReactSelect"
import { type GroupBase, type Props as SelectProps } from "react-select"
import Checkbox from "../Checkbox/Checkox"

export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

interface CustomMultiSelectProps<
  OptionType extends SelectOption,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
> extends Omit<
    SelectProps<OptionType, true, Group>,
    "isMulti" | "value" | "onChange"
  > {
  selectedOptions: OptionType[]
  onChange: (selected: OptionType[]) => void
  customClassNames?: ClassNamesConfig
  customStyles?: StylesConfig<OptionType, true, Group>
}

const CustomMultiSelect = <
  OptionType extends SelectOption,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  options,
  selectedOptions,
  onChange,
  customClassNames = {},
  customStyles = {},
  ...props
}: CustomMultiSelectProps<OptionType, Group>): JSX.Element => {
  const OptionComponent = (
    optionProps: OptionProps<OptionType, true, Group>
  ): JSX.Element => {
    const { isSelected, label, innerRef, innerProps } = optionProps

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center px-2 py-2 cursor-pointer gap-2"
      >
        <Checkbox
          label={label}
          checked={isSelected}
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  }

  return (
    <ReactSelect<OptionType, true, Group>
      {...props}
      options={options}
      customStyles={customStyles}
      customClassNames={customClassNames}
      isMulti
      controlShouldRenderValue={false}
      isClearable={false}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: OptionComponent }}
      onChange={(newValue) => onChange(newValue as OptionType[])}
      value={selectedOptions}
    />
  )
}

export default CustomMultiSelect
