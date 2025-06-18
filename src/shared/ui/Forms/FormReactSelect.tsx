import { useMemo } from "react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form"
import type { OnChangeValue, Props as SelectProps } from "react-select"

import {
  ReactSelectMultiWithError,
  ReactSelectWithError,
  SelectVirtualizedWithError,
} from "../WithError/fieldsWithError"

export type Option<T = unknown> = {
  label: string
  value: T
}

type BaseSelectProps<TValue, IsMulti extends boolean> = Omit<
  SelectProps<Option<TValue>, IsMulti>,
  "value" | "onChange" | "onBlur" | "ref" | "name" | "options"
>

type FormSelectFieldProps<TValue, IsMulti extends boolean> = BaseSelectProps<
  TValue,
  IsMulti
> & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  options: Option<TValue>[] // Это всегда будет полный список
  errorMessage?: string
  isMulti?: IsMulti
  isVirtualized?: boolean // <-- Управляющий проп
}

// ЕДИНЫЙ КОМПОНЕНТ
const FormSelectField = <TValue, IsMulti extends boolean>({
  field,
  fieldState,
  options, // <-- Получаем полный список опций
  isMulti,
  errorMessage,
  isVirtualized,
  ...rest
}: FormSelectFieldProps<TValue, IsMulti>) => {
  // Выбираем, какой компонент рендерить
  const Component = useMemo(() => {
    if (isVirtualized) {
      // Здесь должен быть ваш SelectVirtualizedWithError, который оборачивает исправленный SelectVirtualized
      return SelectVirtualizedWithError
    }
    return isMulti ? ReactSelectMultiWithError : ReactSelectWithError
  }, [isVirtualized, isMulti]) as React.ElementType

  // Эта логика теперь общая и безопасная для обоих случаев
  const selectedValue = useMemo(() => {
    if (isMulti) {
      const fieldValue = Array.isArray(field.value) ? field.value : []
      return options.filter((opt) => fieldValue.includes(opt.value))
    }
    return options.find((opt) => opt.value === field.value) || null
  }, [field.value, options, isMulti])

  const handleChange = (selected: OnChangeValue<Option<TValue>, IsMulti>) => {
    if (isMulti) {
      const values = (selected as Option<TValue>[]).map((opt) => opt.value)
      field.onChange(values)
    } else {
      const value = (selected as Option<TValue> | null)?.value ?? null
      field.onChange(value)
    }
  }

  // Определяем, как передавать опции
  const optionsProps = isVirtualized
    ? { allOptions: options } // для виртуализированного
    : { options: options } // для обычного

  return (
    <Component
      {...rest}
      {...optionsProps} // <-- Передаем правильные пропсы
      ref={field.ref}
      onBlur={field.onBlur}
      name={field.name}
      isMulti={isMulti}
      value={selectedValue} // <-- `selectedValue` теперь будет корректно отображаться
      onChange={handleChange}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormSelectField
