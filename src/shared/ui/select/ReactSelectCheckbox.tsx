import { type JSX } from 'react'
import {
  type GroupBase,
  type OptionProps,
  type Props as SelectProps,
  type StylesConfig,
} from 'react-select'
import Checkbox from '@/shared/ui/checkbox/Checkox'
import ReactSelectNoLabel, {
  type ReactSelectNoLabelClassNamesConfig,
  type ReactSelectNoLabelOption,
} from './ReactSelectNoLabel'

interface CustomMultiSelectProps<
  OptionType extends ReactSelectNoLabelOption,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> extends Omit<SelectProps<OptionType, true, Group>, 'isMulti' | 'value' | 'onChange'> {
  selectedOptions: OptionType[]
  onChange: (selected: OptionType[]) => void
  customClassNames?: ReactSelectNoLabelClassNamesConfig
  customStyles?: StylesConfig<OptionType, true, Group>
}

const CustomMultiSelect = <
  OptionType extends ReactSelectNoLabelOption,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
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
      className="flex cursor-pointer items-center gap-2 px-2 py-2"
    >
      <Checkbox label={label} checked={isSelected} readOnly onClick={(e) => e.stopPropagation()} />
    </div>
  )

  return (
    <ReactSelectNoLabel
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
