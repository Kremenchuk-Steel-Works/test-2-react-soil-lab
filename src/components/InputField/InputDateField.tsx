import React, { forwardRef, useState } from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import { Calendar, X } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"
import { uk } from "date-fns/locale"
import { isValid, parse } from "date-fns"
import InputFieldWithMask from "./InputFieldWithMask"

registerLocale("uk", uk)

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
      locale = "uk",
    },
    ref
  ) => {
    // Определяем максимальную дату: если allowFutureDates true, используем переданный maxDate
    // (или не устанавливаем его, если не передан), иначе - текущая дата.
    const effectiveMaxDate = allowFutureDates ? maxDate : maxDate || new Date()

    // Состояние для отслеживания фокуса
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    // Определяем, заполнено ли поле
    const hasValue = !!value // Преобразуем Date | null | undefined в boolean

    function handleChangeRaw(
      e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
    ) {
      const input = (e?.target as HTMLInputElement)?.value
      if (!input) return
      const parsed = parse(input, "dd.MM.yyyy", new Date(), { locale: uk })
      if (
        isValid(parsed) &&
        (effectiveMaxDate ? parsed <= effectiveMaxDate : true) &&
        (minDate ? parsed >= minDate : true)
      ) {
        onChange(parsed)
      }
    }

    return (
      <div className={`relative w-full ${className || ""}`}>
        <div className="relative">
          <DatePicker
            selected={value}
            onChange={onChange}
            onChangeRaw={handleChangeRaw}
            onBlur={onBlur}
            dateFormat="dd.MM.yyyy"
            placeholderText={placeholder}
            minDate={minDate}
            maxDate={effectiveMaxDate}
            disabled={disabled}
            required={required}
            onCalendarOpen={handleFocus}
            onCalendarClose={handleBlur}
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={200}
            todayButton={showTodayButton ? "Сьогодні" : undefined}
            locale={locale}
            customInput={<InputFieldWithMask ref={ref} label={label} />}
            wrapperClassName="react-datepicker__wrapper w-full"
            calendarClassName="react-datepicker__calendar--themed"
          />
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-11 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none rounded transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <Calendar
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
              isFocused || hasValue
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-500/50 dark:text-gray-400/50"
            }`}
            size={20}
          />
        </div>
      </div>
    )
  }
)

export default InputDateField
