import React, { forwardRef, useId, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useMergeRefs } from '@floating-ui/react'
import { useMask } from '@react-input/mask'
import { uk } from 'date-fns/locale'
import InputField from './InputField' // Предполагаем, что базовый InputField здесь

registerLocale('uk', uk)

export type InputDateTimeFieldProps = {
  label: string
  value: Date | undefined
  onChange: (date: Date | null) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  locale?: string
  id?: string
  name?: string
}

const InputDateTimeFieldWithMask = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, ...props }, ref) => {
  const inputRef = useMask({
    mask: 'дд.мм.рррр __:__',
    replacement: { д: /\d/, м: /\d/, р: /\d/, _: /\d/ },
    showMask: true,
  })
  const mergedRefs = useMergeRefs([ref, inputRef])

  return <InputField {...props} label={label} ref={mergedRefs} />
})
InputDateTimeFieldWithMask.displayName = 'InputDateTimeFieldWithMask'

const InputDateTimeField = forwardRef<HTMLInputElement, InputDateTimeFieldProps>(
  (
    {
      label,
      value,
      onChange,
      onBlur,
      placeholder,
      required,
      disabled = false,
      className,
      locale = 'uk',
      id,
      name,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const generatedId = useId()
    const finalId = id || generatedId
    const hasValue = !!value

    return (
      <div className={`relative w-full ${className || ''}`}>
        <div className="relative">
          <DatePicker
            selected={value}
            onChange={onChange}
            onBlur={onBlur}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Час"
            dateFormat="dd.MM.yyyy HH:mm"
            placeholderText={placeholder}
            disabled={disabled}
            required={required}
            onCalendarOpen={() => setIsFocused(true)}
            onCalendarClose={() => setIsFocused(false)}
            locale={locale}
            customInput={
              <InputDateTimeFieldWithMask ref={ref} id={finalId} name={name} label={label} />
            }
            wrapperClassName="react-datepicker__wrapper w-full"
            calendarClassName="react-datepicker__calendar--themed"
          />
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-1/2 right-11 -translate-y-1/2 transform rounded text-gray-600 transition-colors hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}
          <Calendar
            className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform ${
              isFocused || hasValue
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-500/50 dark:text-gray-400/50'
            }`}
            size={20}
          />
        </div>
      </div>
    )
  },
)

InputDateTimeField.displayName = 'InputDateTimeField'
export default InputDateTimeField
