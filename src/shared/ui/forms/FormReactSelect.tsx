import { useMemo } from 'react'
import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import type { GroupBase, OnChangeValue, Props as SelectProps } from 'react-select'
import type { CreatableProps } from 'react-select/creatable'
import {
  ReactSelectMultiWithError,
  ReactSelectWithError,
  SelectVirtualizedWithError,
} from '@/shared/ui/with-error/fieldsWithError'

export type Option<T = unknown> = {
  label: string
  value: T
}

type BaseSelectProps<TValue, IsMulti extends boolean> = Omit<
  SelectProps<Option<TValue>, IsMulti>,
  'value' | 'onChange' | 'onBlur' | 'ref' | 'name' | 'options'
>

type FormSelectFieldProps<TValue, IsMulti extends boolean> = BaseSelectProps<TValue, IsMulti> & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  options: Option<TValue>[]
  errorMessage?: string
  isMulti?: IsMulti
  isVirtualized?: boolean
  isCreatable?: boolean
  formatCreateLabel?: CreatableProps<
    Option<TValue>,
    IsMulti,
    GroupBase<Option<TValue>>
  >['formatCreateLabel']
}

// ЕДИНЫЙ КОМПОНЕНТ
const FormSelectField = <TValue, IsMulti extends boolean>({
  field,
  fieldState,
  options,
  isMulti,
  errorMessage,
  isVirtualized,
  isCreatable,
  ...rest
}: FormSelectFieldProps<TValue, IsMulti>) => {
  const Component = useMemo(() => {
    if (isVirtualized) {
      return SelectVirtualizedWithError
    }
    return isMulti ? ReactSelectMultiWithError : ReactSelectWithError
  }, [isVirtualized, isMulti]) as React.ElementType

  // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ ---
  const selectedValue = useMemo(() => {
    const fieldValue = field.value

    if (isMulti) {
      const fieldValuesArray = Array.isArray(fieldValue) ? fieldValue : []

      // Если это Creatable Select, то label и value - это одно и то же.
      if (isCreatable) {
        return fieldValuesArray.map((val) => ({ label: String(val), value: val as TValue }))
      }

      // Для ОБЫЧНОГО Multi-Select, мы должны найти полные объекты в `options`, чтобы получить правильные `label`.
      return options.filter((opt) => fieldValuesArray.includes(opt.value))
    }

    // Логика для одиночного Select остается прежней, она работает корректно.
    return options.find((opt) => opt.value === fieldValue) || null
  }, [field.value, options, isMulti, isCreatable]) // <-- Добавлен isCreatable в зависимости

  const handleChange = (selected: OnChangeValue<Option<TValue>, IsMulti>) => {
    if (isMulti) {
      const values = (selected as Option<TValue>[]).map((opt) => opt.value)
      const uniqueValues = [...new Set(values)]
      field.onChange(uniqueValues)
    } else {
      const value = (selected as Option<TValue> | null)?.value ?? null
      field.onChange(value)
    }
  }

  const optionsProps = isVirtualized ? { allOptions: options } : { options: options }

  return (
    <Component
      {...rest}
      {...optionsProps}
      ref={field.ref}
      onBlur={field.onBlur}
      name={field.name}
      isMulti={isMulti}
      isCreatable={isCreatable}
      value={selectedValue}
      onChange={handleChange}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormSelectField
