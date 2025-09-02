import { useMemo } from 'react'
import { addYears, format, getYear, isValid, subYears } from 'date-fns'
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import {
  DateTimePicker,
  type DateTimePickerProps,
  type DateTimePickerType,
} from '@/shared/ui/input-field/DateTime/DateTimePicker'
import { WithError } from '@/shared/ui/with-error/WithError'

type FormDateTimeFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = Omit<DateTimePickerProps, 'value' | 'onChange' | 'onBlur' | 'ref' | 'type'> & {
  field: ControllerRenderProps<TFieldValues, TName>
  fieldState: ControllerFieldState
  type?: DateTimePickerType
  yearOffsetPast?: number
  yearOffsetFuture?: number
  stringFormat?: string
  errorMessage?: string
}

const FormDateTimeField = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  field,
  fieldState: _fieldState,
  type = 'date',
  yearOffsetPast,
  yearOffsetFuture,
  stringFormat,
  errorMessage,
  ...rest
}: FormDateTimeFieldProps<TFieldValues, TName>) => {
  void _fieldState
  const getFormat = () => {
    if (stringFormat) return stringFormat
    switch (type) {
      case 'time':
        return 'HH:mm'
      case 'datetime':
        return "yyyy-MM-dd'T'HH:mm"
      case 'date':
        return 'yyyy-MM-dd'
      case 'year':
        return 'yyyy'
      default:
        return 'yyyy-MM-dd'
    }
  }

  const finalFormat = getFormat()

  const handleChange = (date: Date | null) => {
    // Если тип - год, то работаем с ним как с числом
    if (type === 'year') {
      const yearValue = date ? getYear(date) : null
      field.onChange(yearValue)
      return
    }

    // Для всех остальных типов
    const formattedDate = date ? format(date, finalFormat) : null
    field.onChange(formattedDate)
  }

  const parseValue = (value: string | number | undefined): Date | undefined => {
    if (value === undefined || value === null) {
      return undefined
    }

    // Если значение - число (например, для типа 'year')
    if (typeof value === 'number') {
      return new Date(value, 0, 1)
    }

    // Если значение - строка, используем конструктор Date,
    // который отлично справляется с форматом ISO 8601 (включая "Z").
    if (typeof value === 'string') {
      const parsedDate = new Date(value)
      return isValid(parsedDate) ? parsedDate : undefined
    }

    return undefined
  }

  const { minDate, maxDate } = useMemo(() => {
    const now = new Date()
    const min = yearOffsetPast !== undefined ? subYears(now, yearOffsetPast) : undefined
    const max = yearOffsetFuture !== undefined ? addYears(now, yearOffsetFuture) : undefined
    return { minDate: min, maxDate: max }
  }, [yearOffsetPast, yearOffsetFuture])

  const valueAsDate = parseValue(field.value)

  return (
    <WithError errorMessage={errorMessage}>
      <DateTimePicker
        {...rest}
        type={type}
        minDate={minDate}
        maxDate={maxDate}
        value={valueAsDate}
        onChange={handleChange}
        onBlur={field.onBlur}
        ref={field.ref}
      />
    </WithError>
  )
}

export default FormDateTimeField
