import { useMemo, useState, type JSX } from "react"
import { type GroupBase, type Props as SelectProps } from "react-select"
import ReactSelect, { type Option } from "./ReactSelect"
import { VirtualizedMenuList } from "./VirtualizedMenuList"

interface VirtualizedSelectProps<
  OptionType extends Option<any>,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
> extends SelectProps<OptionType, IsMulti, Group> {
  allOptions?: OptionType[]
}

const OPTIONS_SHOWN_LIMIT = 1000

export function SelectVirtualized<
  OptionType extends Option<any>,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  allOptions = [],
  value,
  ...props
}: VirtualizedSelectProps<OptionType, IsMulti, Group>): JSX.Element {
  const [inputValue, setInputValue] = useState("")

  const filteredOptions = useMemo(() => {
    let results: OptionType[] = []

    if (!inputValue) {
      results = allOptions.slice(0, OPTIONS_SHOWN_LIMIT)
    } else {
      const lowerCasedInput = inputValue.toLowerCase()
      for (const option of allOptions) {
        if (option.label.toLowerCase().includes(lowerCasedInput)) {
          results.push(option)
          if (results.length >= OPTIONS_SHOWN_LIMIT) break
        }
      }
    }

    if (value) {
      const selectedAsArray = Array.isArray(value) ? value : [value]
      const valueSet = new Set(results.map((opt) => opt.value))

      const missingSelected = selectedAsArray.filter(
        (selectedOpt) => selectedOpt && !valueSet.has(selectedOpt.value)
      )

      if (missingSelected.length > 0) {
        results = [...missingSelected, ...results]
      }
    }

    return results
  }, [allOptions, inputValue, value])

  return (
    <ReactSelect
      {...props}
      value={value}
      options={filteredOptions}
      components={{
        ...props.components,
        MenuList: VirtualizedMenuList,
      }}
      inputValue={inputValue}
      onInputChange={(newValue, actionMeta) => {
        if (
          actionMeta.action !== "input-blur" &&
          actionMeta.action !== "menu-close"
        ) {
          setInputValue(newValue)
        }
        props.onInputChange?.(newValue, actionMeta)
      }}
      filterOption={null}
    />
  )
}
