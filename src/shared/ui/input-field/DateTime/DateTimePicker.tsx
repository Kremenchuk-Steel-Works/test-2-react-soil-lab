import { forwardRef } from 'react'
import InputDateField, {
  type InputDateFieldProps,
} from '@/shared/ui/input-field/DateTime/InputDateField'
import InputDateTimeField, {
  type InputDateTimeFieldProps,
} from '@/shared/ui/input-field/DateTime/InputDateTimeField'
import InputTimeField, {
  type InputTimeFieldProps,
} from '@/shared/ui/input-field/DateTime/InputTimeField'
import InputYearField, {
  type InputYearFieldProps,
} from '@/shared/ui/input-field/DateTime/InputYearField'

export type DateTimePickerType = 'date' | 'time' | 'datetime' | 'year'

type SharedProps = Omit<
  InputDateFieldProps & InputTimeFieldProps & InputDateTimeFieldProps & InputYearFieldProps,
  'ref'
>

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
      case 'year':
        return <InputYearField {...props} ref={ref} />
      case 'date':
      default:
        return <InputDateField {...props} ref={ref} />
    }
  },
)
