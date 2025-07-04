import { useEffect, useMemo, useState, type ComponentProps } from 'react'
import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import type { OnChangeValue } from 'react-select'
import ReactSelect, { type Option } from '@/shared/ui/select/ReactSelect'
import {
  ReactSelectMultiWithError,
  ReactSelectWithError,
} from '@/shared/ui/with-error/fieldsWithError'

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
    return isMulti ? ReactSelectMultiWithError : ReactSelectWithError
  }, [isMulti]) as React.ElementType

  const { name, value: fieldValue, onChange, onBlur, ref } = field

  // Кэш для всех опций, которые мы когда-либо видели (начальные, загруженные, созданные).
  const [optionsCache, setOptionsCache] = useState(new Map<TValue, Option<TValue>>())

  // Эффект для первоначального заполнения и обновления кэша из пропсов
  useEffect(() => {
    const allInitialOptions = [
      ...(options || []),
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

  // Преобразуем ID из формы в объекты для react-select, используя наш кэш
  const selectedValue = useMemo(() => {
    if (isMulti) {
      const fieldValuesArray = Array.isArray(fieldValue) ? fieldValue : []
      return fieldValuesArray
        .map((value) => optionsCache.get(value))
        .filter((option): option is Option<TValue> => !!option)
    }
    return optionsCache.get(fieldValue as TValue) || null
  }, [fieldValue, optionsCache, isMulti])

  // Обработчик изменений
  const handleChange = (selected: OnChangeValue<Option<TValue>, IsMulti>) => {
    const selectedOptionsArray = (Array.isArray(selected) ? selected : [selected]).filter(
      Boolean,
    ) as Option<TValue>[]

    // Обновляем кэш новыми выбранными опциями
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

    // Обновляем состояние формы (react-hook-form) только ID
    if (isMulti) {
      const values = selectedOptionsArray.map((opt) => opt.value)
      onChange(values)
    } else {
      const value = (selected as Option<TValue> | null)?.value ?? null
      onChange(value)
    }
  }

  return (
    <Component
      {...(rest as any)}
      instanceId={name}
      ref={ref}
      name={name}
      onBlur={onBlur}
      value={selectedValue}
      onChange={handleChange}
      options={options}
      isCreatable={isCreatable}
      isVirtualized={isVirtualized}
      isMulti={isMulti}
      defaultOptions={defaultOptions}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormSelectField
