import { useEffect, useMemo, useState } from 'react'
import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import type { OnChangeValue } from 'react-select'
import ReactSelect, { type Option, type ReactSelectProps } from '@/shared/ui/select/ReactSelect'
import { WithError } from '@/shared/ui/with-error/WithError'

type FormSelectFieldProps<
  OptionType extends Option,
  IsMulti extends boolean = false,
> = ReactSelectProps<OptionType, IsMulti> & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  errorMessage?: string
  defaultOptions?: OptionType[] | boolean
}

function FormSelectField<OptionType extends Option, IsMulti extends boolean = false>({
  field,
  fieldState,
  isMulti,
  options,
  defaultOptions,
  errorMessage,
  ...rest
}: FormSelectFieldProps<OptionType, IsMulti>) {
  const { name, value: fieldValue, onChange, onBlur } = field

  const [optionsCache, setOptionsCache] = useState(new Map<OptionType['value'], OptionType>())

  useEffect(() => {
    const allInitialOptions = [
      ...(Array.isArray(options) ? options : []),
      ...(Array.isArray(defaultOptions) ? defaultOptions : []),
    ]

    if (allInitialOptions.length > 0) {
      setOptionsCache((prevCache) => {
        const newCache = new Map(prevCache)
        allInitialOptions.forEach((opt) => {
          if (!newCache.has(opt.value)) {
            newCache.set(opt.value, opt)
          }
        })
        return newCache
      })
    }
  }, [options, defaultOptions])

  const selectedValue = useMemo(() => {
    if (isMulti) {
      const fieldValuesArray = Array.isArray(fieldValue) ? fieldValue : []
      return fieldValuesArray
        .map((value) => optionsCache.get(value))
        .filter((option): option is OptionType => !!option)
    }
    return optionsCache.get(fieldValue as OptionType['value']) || null
  }, [fieldValue, optionsCache, isMulti])

  const handleChange = (selected: OnChangeValue<OptionType, IsMulti>) => {
    const selectedOptionsArray = (Array.isArray(selected) ? selected : [selected]).filter(
      Boolean,
    ) as OptionType[]

    if (selectedOptionsArray.length > 0) {
      setOptionsCache((prevCache) => {
        const newCache = new Map(prevCache)
        selectedOptionsArray.forEach((opt) => {
          if (opt && !newCache.has(opt.value)) {
            newCache.set(opt.value, opt)
          }
        })
        return newCache
      })
    }

    if (isMulti) {
      const values = selectedOptionsArray.map((opt) => opt.value)
      onChange(values)
    } else {
      const value = (selected as OptionType | null)?.value ?? null
      onChange(value)
    }
  }

  return (
    <WithError errorMessage={errorMessage}>
      <ReactSelect
        {...rest}
        instanceId={name}
        name={name}
        onBlur={onBlur}
        value={selectedValue}
        onChange={handleChange}
        options={options}
        isMulti={isMulti}
      />
    </WithError>
  )
}

export default FormSelectField
