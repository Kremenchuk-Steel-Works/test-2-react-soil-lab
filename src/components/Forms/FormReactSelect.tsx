import { useMemo } from "react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form"
import type { OnChangeValue, Props as SelectProps } from "react-select"

import {
  ReactSelectMultiWithError,
  ReactSelectWithError,
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
  options: Option<TValue>[]
  errorMessage?: string
  isMulti?: IsMulti
}

/**
 * Универсальный компонент-обертка над ReactSelect для использования с React Hook Form.
 * Автоматически выбирает между одиночным и множественным выбором на основе пропа `isMulti`.
 * Инкапсулирует логику преобразования значений для `react-hook-form`.
 * @template TValue - Тип значения опции (например, string, number).
 * @template IsMulti - Булев тип, определяющий режим (true для multi, false для single).
 */
const FormSelectField = <TValue, IsMulti extends boolean>({
  field,
  fieldState,
  options,
  isMulti,
  errorMessage,
  ...rest
}: FormSelectFieldProps<TValue, IsMulti>) => {
  const Component = (
    isMulti ? ReactSelectMultiWithError : ReactSelectWithError
  ) as React.ElementType

  // Мемоизируем вычисление выбранного значения, чтобы избежать лишних перерисовок
  const selectedValue = useMemo(() => {
    if (isMulti) {
      const fieldValue = Array.isArray(field.value) ? field.value : []
      return options.filter((opt) => fieldValue.includes(opt.value))
    }
    return options.find((opt) => opt.value === field.value) || null
  }, [field.value, options, isMulti])

  // Обработчик изменений, который возвращает в форму только значения
  const handleChange = (selected: OnChangeValue<Option<TValue>, IsMulti>) => {
    if (isMulti) {
      const values = (selected as Option<TValue>[]).map((opt) => opt.value)
      field.onChange(values)
    } else {
      const value = (selected as Option<TValue> | null)?.value ?? null
      field.onChange(value)
    }
  }

  return (
    <Component
      {...rest}
      ref={field.ref}
      onBlur={field.onBlur}
      name={field.name}
      // Кастомные пропсы
      options={options}
      isMulti={isMulti}
      value={selectedValue}
      onChange={handleChange}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormSelectField
