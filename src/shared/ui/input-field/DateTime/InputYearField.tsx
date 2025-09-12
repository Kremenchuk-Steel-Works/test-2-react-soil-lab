import React, { forwardRef, useId, useRef, useState } from 'react'
import { Calendar, X } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { isValid, parse } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useCloseOnScrollOutside } from '@/shared/hooks/useCloseOnScrollOutside'
import InputFieldWithMask from '@/shared/ui/input-field/DateTime/InputFieldWithMask'
import { DatePickerPortal } from '@/shared/ui/input-field/DateTime/portal/DatePickerPortal'

registerLocale('uk', uk)

// 1. Добавляем новые пропсы для управления диапазоном
export type InputYearFieldProps = {
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
  locale?: string
  id?: string
  name?: string
}

const InputYearField = forwardRef<HTMLInputElement, InputYearFieldProps>(
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

    // Используем onChangeRaw для надежной обработки ручного ввода
    const handleChangeRaw = (
      e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
      const inputValue = (e?.target as HTMLInputElement)?.value

      if (inputValue === '' || inputValue === '____') {
        onChange(null)
        return
      }

      // Проверяем, что год введен полностью (4 цифры)
      if (!/^\d{4}$/.test(inputValue)) {
        return
      }

      const parsedDate = parse(inputValue, 'yyyy', new Date())

      if (isValid(parsedDate)) {
        const isWithinMaxDate = effectiveMaxDate ? parsedDate <= effectiveMaxDate : true
        const isWithinMinDate = minDate ? parsedDate >= minDate : true

        // Применяем значение, только если оно в разрешенном диапазоне
        if (isWithinMaxDate && isWithinMinDate) {
          onChange(parsedDate)
        }
      }
    }

    return (
      <div className={`relative w-full ${className || ''}`}>
        <DatePicker
          ref={datePickerRef}
          selected={value}
          onChange={onChange}
          onChangeRaw={handleChangeRaw}
          onBlur={onBlur}
          onCalendarOpen={() => setCalendarOpen(true)}
          onCalendarClose={() => setCalendarOpen(false)}
          showYearPicker
          dateFormat="yyyy"
          minDate={minDate}
          maxDate={effectiveMaxDate}
          scrollableYearDropdown
          yearDropdownItemNumber={200}
          customInput={
            <InputFieldWithMask
              ref={ref}
              id={finalId}
              name={name}
              label={label}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              maskOptions={{
                mask: '____',
                replacement: { _: /\d/ },
                showMask: false,
                separate: true,
              }}
            />
          }
          placeholderText={placeholder}
          disabled={disabled}
          required={required}
          locale={locale}
          onInputClick={() => datePickerRef.current?.setFocus()}
          wrapperClassName="w-full"
          calendarClassName="react-datepicker__calendar--themed"
          popperClassName="react-datepicker-popper"
          popperContainer={DatePickerPortal}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChange(null)}
            className="absolute top-1/2 right-11 -translate-y-1/2 transform rounded text-gray-600 transition-colors hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Очистити рік"
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

export default InputYearField
