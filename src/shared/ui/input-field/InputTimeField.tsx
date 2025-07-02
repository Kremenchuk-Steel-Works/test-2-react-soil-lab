import React, { forwardRef, useCallback, useId, useState } from 'react'
import { Clock, X } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useMergeRefs } from '@floating-ui/react'
import { useMask } from '@react-input/mask'
import { isValid, parse } from 'date-fns'
import { uk } from 'date-fns/locale'
import { getCorrectedTimeString } from '@/shared/lib/react-input-mask/сorrected-time-string'
import InputField from './InputField'

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

const InputTimeFieldWithMask = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, onChange, ...props }, ref) => {
  const inputRef = useMask({
    mask: 'гг:хх',
    replacement: { г: /\d/, х: /\d/ },
    showMask: false,
    separate: true,
  })

  const mergedRefs = useMergeRefs([ref, inputRef])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const originalValue = input.value
      const originalCursorPosition = input.selectionStart
      const correctedValue = getCorrectedTimeString(originalValue, originalCursorPosition)

      if (originalValue !== correctedValue) {
        input.value = correctedValue
        if (originalCursorPosition !== null) {
          const newCursorPosition =
            originalCursorPosition + (correctedValue.length - originalValue.length)
          requestAnimationFrame(() => {
            input.setSelectionRange(newCursorPosition, newCursorPosition)
          })
        }
      }
      if (onChange) {
        onChange(e)
      }
    },
    [onChange],
  )

  return <InputField {...props} label={label} ref={mergedRefs} onChange={handleChange} />
})

InputTimeFieldWithMask.displayName = 'InputTimeFieldWithMask'

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
    const [isFocused, setIsFocused] = useState(false)
    const generatedId = useId()
    const finalId = id || generatedId
    const hasValue = !!value

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (!inputValue || inputValue.includes('ч') || inputValue.includes('м')) {
        // Если значение неполное, просто вызываем родительский onBlur и выходим
        if (onBlur) {
          onBlur(e)
        }
        return
      }

      const parsedDate = parse(inputValue, 'HH:mm', new Date())
      if (isValid(parsedDate)) {
        onChange(parsedDate)
      }

      if (onBlur) {
        onBlur(e)
      }
    }

    return (
      <div className={`relative w-full ${className || ''}`}>
        <div className="relative">
          <DatePicker
            selected={value}
            onChange={onChange}
            onBlur={handleBlur}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Час"
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            placeholderText={placeholder}
            disabled={disabled}
            required={required}
            onCalendarOpen={() => setIsFocused(true)}
            onCalendarClose={() => setIsFocused(false)}
            locale={locale}
            customInput={
              <InputTimeFieldWithMask ref={ref} id={finalId} name={name} label={label} />
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
          <Clock
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

InputTimeField.displayName = 'InputTimeField'
export default InputTimeField
