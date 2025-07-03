import React, { forwardRef, useId, useRef, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { isValid, parse } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useCloseOnScrollOutside } from '@/shared/hooks/useCloseOnScrollOutside'
import { getCorrectedDateTimeString } from '@/shared/lib/react-input-mask/сorrected-date-time-string'
import InputFieldWithMask from './InputFieldWithMask'

registerLocale('uk', uk)

export type InputDateTimeFieldProps = {
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
  timeIntervals?: number
  locale?: string
  id?: string
  name?: string
}

const InputDateTimeField = forwardRef<HTMLInputElement, InputDateTimeFieldProps>(
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
      timeIntervals = 15,
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

    const handleChangeRaw = (
      e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
      const input = (e?.target as HTMLInputElement)?.value
      if (!input || !/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/.test(input)) return

      const parsed = parse(input, 'dd.MM.yyyy HH:mm', new Date(), { locale: uk })

      if (
        isValid(parsed) &&
        (effectiveMaxDate ? parsed <= effectiveMaxDate : true) &&
        (minDate ? parsed >= minDate : true)
      ) {
        onChange(parsed)
      }
    }

    return (
      <div className={`relative w-full ${className || ''}`}>
        <DatePicker
          ref={datePickerRef}
          onCalendarOpen={() => setCalendarOpen(true)}
          onCalendarClose={() => setCalendarOpen(false)}
          onInputClick={() => datePickerRef.current?.setFocus()}
          popperClassName="react-datepicker-popper"
          selected={value}
          onChange={onChange}
          onChangeRaw={handleChangeRaw}
          onBlur={onBlur}
          dateFormat="dd.MM.yyyy HH:mm"
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
          customInput={
            <InputFieldWithMask
              ref={ref}
              id={finalId}
              name={name}
              label={label}
              maskOptions={{
                mask: '__.__.____ __:__',
                replacement: { _: /\d/ },
                showMask: false,
                separate: true,
              }}
              correctionFn={getCorrectedDateTimeString}
            />
          }
          wrapperClassName="w-full"
          calendarClassName="react-datepicker__calendar--themed"
          showTimeSelect
          fixedHeight
          timeIntervals={timeIntervals}
          timeCaption="Час"
          timeFormat="HH:mm"
        />
        {hasValue && !disabled && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange(null)}
            className="absolute top-1/2 right-11 -translate-y-1/2 transform rounded text-gray-600 transition-colors hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Очистить дату и время"
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

InputDateTimeField.displayName = 'InputDateTimeField'
export default InputDateTimeField
