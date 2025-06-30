import { useMemo, type ComponentProps } from 'react'
import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import type { OnChangeValue } from 'react-select'
import ReactSelect, { type Option } from '@/shared/ui/select/ReactSelect'
import {
  ReactSelectMultiWithError,
  ReactSelectWithError,
  SelectVirtualizedWithError,
} from '../with-error/fieldsWithError'

type ReactSelectProps = ComponentProps<typeof ReactSelect>

type BaseSelectProps = Omit<ReactSelectProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'ref'>

type FormSelectFieldProps<TValue, IsMulti extends boolean = false> = BaseSelectProps & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  isMulti?: IsMulti
  errorMessage?: string
  isVirtualized?: boolean
  options?: Option<TValue>[]
  defaultOptions?: Option<TValue>[] | boolean
}

function FormSelectField<TValue, IsMulti extends boolean = false>({
  field,
  fieldState,
  isMulti,
  isVirtualized,
  isCreatable,
  options,
  defaultOptions,
  errorMessage,
  ...rest
}: FormSelectFieldProps<TValue, IsMulti>) {
  const Component = useMemo(() => {
    if (isVirtualized) {
      return SelectVirtualizedWithError
    }
    return isMulti ? ReactSelectMultiWithError : ReactSelectWithError
  }, [isVirtualized, isMulti]) as React.ElementType

  const { name, value: fieldValue, onChange, onBlur, ref } = field
  const selectedValue = useMemo(() => {
    const allAvailableOptions = [
      ...(options || []),
      ...(Array.isArray(defaultOptions) ? defaultOptions : []),
    ]

    if (isMulti) {
      const fieldValuesArray = Array.isArray(fieldValue) ? fieldValue : []

      if (isCreatable) {
        return fieldValuesArray.map(
          (val) =>
            allAvailableOptions.find((opt) => opt.value === val) ?? {
              label: String(val),
              value: val as TValue,
            },
        )
      }

      const valueSet = new Set(fieldValuesArray)
      return allAvailableOptions.filter((opt) => valueSet.has(opt.value))
    }

    // Для одиночного значения
    return allAvailableOptions.find((opt) => opt.value === fieldValue) || null
  }, [fieldValue, options, defaultOptions, isMulti, isCreatable])

  // Обработчик изменений
  const handleChange = (selected: OnChangeValue<Option<TValue>, IsMulti>) => {
    if (isMulti) {
      const values = (selected as Option<TValue>[] | null)?.map((opt) => opt.value) ?? []
      onChange(values)
    } else {
      const value = (selected as Option<TValue> | null)?.value ?? null
      onChange(value)
    }
  }

  const optionsProps = isVirtualized ? { allOptions: options } : { options: options }

  return (
    <Component
      {...(rest as any)}
      instanceId={name}
      ref={ref}
      name={name}
      onBlur={onBlur}
      value={selectedValue}
      onChange={handleChange}
      {...optionsProps}
      isCreatable={isCreatable}
      isMulti={isMulti}
      defaultOptions={defaultOptions}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormSelectField
