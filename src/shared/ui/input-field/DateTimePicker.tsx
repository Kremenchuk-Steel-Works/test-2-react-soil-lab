import { forwardRef } from 'react'
import InputDateField, { type InputDateFieldProps } from './InputDateField'
import InputDateTimeField, { type InputDateTimeFieldProps } from './InputDateTimeField'
import InputTimeField, { type InputTimeFieldProps } from './InputTimeField'

export type DateTimePickerType = 'date' | 'time' | 'datetime'

// Собираем все возможные пропсы в один тип
type SharedProps = Omit<InputDateFieldProps & InputTimeFieldProps & InputDateTimeFieldProps, 'ref'>

export type DateTimePickerProps = SharedProps & {
  type: DateTimePickerType
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  ({ type, ...props }, ref) => {
    switch (type) {
      case 'time':
        return <InputTimeField {...props} ref={ref} />
      case 'datetime':
        return <InputDateTimeField {...props} ref={ref} />
      case 'date':
      default:
        return <InputDateField {...props} ref={ref} />
    }
  },
)

DateTimePicker.displayName = 'DateTimePicker'
