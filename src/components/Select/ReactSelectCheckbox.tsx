import { type JSX } from "react"
import { type OptionProps, type StylesConfig } from "react-select"
import ReactSelect, { type ClassNamesConfig, type Option } from "./ReactSelect"
import { type GroupBase, type Props as SelectProps } from "react-select"
import Checkbox from "../Checkbox/Checkox"

interface CustomMultiSelectProps<
  OptionType extends Option,
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
  OptionType extends Option,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  options,
  selectedOptions,
  onChange,
  customClassNames,
  customStyles,
  ...props
}: CustomMultiSelectProps<OptionType, Group>): JSX.Element => {
  const OptionComponent = ({
    isSelected,
    label,
    innerRef,
    innerProps,
  }: OptionProps<OptionType, true, Group>) => (
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

  return (
    <ReactSelect
      {...props}
      isMulti
      options={options}
      value={selectedOptions}
      onChange={(value) => onChange(value as OptionType[])}
      customClassNames={customClassNames}
      customStyles={customStyles}
      controlShouldRenderValue={false}
      isClearable={false}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: OptionComponent }}
    />
  )
}

export default CustomMultiSelect
