import React, { forwardRef, useId, useRef, useState } from 'react'
import { Clock, X } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { isValid, parse } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useCloseOnScrollOutside } from '@/shared/hooks/useCloseOnScrollOutside'
import { getCorrectedTimeString } from '@/shared/lib/react-input-mask/сorrected-time-string'
import InputFieldWithMask from './InputFieldWithMask'

registerLocale('uk', uk)

export type InputTimeFieldProps = {
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

const InputTimeField = forwardRef<HTMLInputElement, InputTimeFieldProps>(
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
    const [isCalendarOpen, setCalendarOpen] = useState(false)
    const datePickerRef = useRef<DatePicker>(null)
    const generatedId = useId()
    const finalId = id || generatedId
    const hasValue = !!value

    useCloseOnScrollOutside(isCalendarOpen, datePickerRef)

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (!inputValue || inputValue.includes('_')) {
        onBlur?.(e)
        return
      }
      const parsedDate = parse(inputValue, 'HH:mm', new Date())
      if (isValid(parsedDate)) {
        onChange(parsedDate)
      }
      onBlur?.(e)
    }

    return (
      <div className={`relative w-full ${className || ''}`}>
        <DatePicker
          ref={datePickerRef}
          selected={value}
          onChange={onChange}
          onCalendarOpen={() => setCalendarOpen(true)}
          onCalendarClose={() => setCalendarOpen(false)}
          customInput={
            <InputFieldWithMask
              ref={ref}
              id={finalId}
              name={name}
              label={label}
              onBlur={handleBlur}
              maskOptions={{
                mask: '__:__',
                replacement: { _: /\d/ },
                showMask: false,
                separate: true,
              }}
              correctionFn={getCorrectedTimeString}
            />
          }
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Час"
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          placeholderText={placeholder}
          disabled={disabled}
          required={required}
          locale={locale}
          onInputClick={() => datePickerRef.current?.setFocus()}
          wrapperClassName="w-full"
          calendarClassName="react-datepicker__calendar--themed"
          popperClassName="react-datepicker-popper"
        />
        {hasValue && !disabled && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange(null)}
            className="absolute top-1/2 right-11 -translate-y-1/2 transform rounded text-gray-600 transition-colors hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Очистить время"
          >
            <X size={16} />
          </button>
        )}
        <Clock
          className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform ${
            isCalendarOpen || hasValue
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-gray-500/50 dark:text-gray-400/50'
          }`}
          size={20}
        />
      </div>
    )
  },
)

InputTimeField.displayName = 'InputTimeField'
export default InputTimeField
