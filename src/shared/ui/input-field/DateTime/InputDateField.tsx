import React, { forwardRef, useId, useRef, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { isValid, parse } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useCloseOnScrollOutside } from '@/shared/hooks/useCloseOnScrollOutside'
import { getCorrectedDateString } from '@/shared/lib/react-input-mask/сorrected-date-string'
import InputFieldWithMask from './InputFieldWithMask'

registerLocale('uk', uk)

export type InputDateFieldProps = {
  label: string
  value: Date | undefined
  onChange: (date: Date | null) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  required?: boolean
  className?: string
  allowFutureDates?: boolean
  showTodayButton?: boolean
  locale?: string
  id?: string
  name?: string
}

const InputDateField = forwardRef<HTMLInputElement, InputDateFieldProps>(
  (
    {
      label,
      value,
      onChange,
      onBlur,
      placeholder,
      minDate,
      maxDate,
      required,
      disabled = false,
      className,
      allowFutureDates = false,
      showTodayButton = false,
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

    const effectiveMaxDate = allowFutureDates ? maxDate : maxDate || new Date()

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      onBlur?.(e)

      if (!inputValue || inputValue.includes('_')) {
        return
      }

      const parsedDate = parse(inputValue, 'dd.MM.yyyy', new Date())

      if (isValid(parsedDate)) {
        const isWithinMaxDate = effectiveMaxDate ? parsedDate <= effectiveMaxDate : true
        const isWithinMinDate = minDate ? parsedDate >= minDate : true

        if (isWithinMaxDate && isWithinMinDate) {
          onChange(parsedDate)
        } else {
          onChange(null)
        }
      }
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
                mask: '__.__.____',
                replacement: { _: /\d/ },
                showMask: false,
                separate: true,
              }}
              correctionFn={getCorrectedDateString}
            />
          }
          dateFormat="dd.MM.yyyy"
          placeholderText={placeholder}
          minDate={minDate}
          maxDate={effectiveMaxDate}
          disabled={disabled}
          required={required}
          showYearDropdown
          showMonthDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={200}
          todayButton={showTodayButton ? 'Сьогодні' : undefined}
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
            aria-label="Очистить дату"
          >
            <X size={16} />
          </button>
        )}
        <Calendar
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

export default InputDateField
