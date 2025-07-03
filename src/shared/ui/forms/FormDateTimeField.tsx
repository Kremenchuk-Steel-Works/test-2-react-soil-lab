import { format, isValid, parse } from 'date-fns'
import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import type {
  DateTimePickerProps,
  DateTimePickerType,
} from '../input-field/DateTime/DateTimePicker'
import { DateTimePickerWithError } from '../with-error/fieldsWithError'

type FormDateTimeFieldProps = Omit<
  DateTimePickerProps,
  'value' | 'onChange' | 'onBlur' | 'ref' | 'type'
> & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  type?: DateTimePickerType
  stringFormat?: string
  errorMessage?: string
}

const FormDateTimeField = ({
  field,
  fieldState,
  type = 'date',
  stringFormat,
  errorMessage,
  ...rest
}: FormDateTimeFieldProps) => {
  const getFormat = () => {
    if (stringFormat) return stringFormat
    switch (type) {
      case 'time':
        return 'HH:mm'
      case 'datetime':
        return "yyyy-MM-dd'T'HH:mm"
      case 'date':
        return 'yyyy-MM-dd'
      default:
        return 'yyyy-MM-dd'
    }
  }

  const finalFormat = getFormat()

  const handleChange = (date: Date | null) => {
    const formattedDate = date ? format(date, finalFormat) : null
    field.onChange(formattedDate)
  }

  const parseValue = (value: string | undefined): Date | undefined => {
    if (!value) return undefined

    const parsedDate = parse(value, finalFormat, new Date())

    return isValid(parsedDate) ? parsedDate : undefined
  }

  const valueAsDate = parseValue(field.value)

  return (
    <DateTimePickerWithError
      {...rest}
      type={type}
      value={valueAsDate}
      onChange={handleChange}
      onBlur={field.onBlur}
      ref={field.ref}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormDateTimeField
