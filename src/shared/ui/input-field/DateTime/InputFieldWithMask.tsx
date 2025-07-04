import React, { forwardRef, useCallback, useEffect } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { useMask, type MaskOptions } from '@react-input/mask'
import InputField, { type InputFieldProps } from '@/shared/ui/input-field/InputField'

type InputFieldWithMaskProps = InputFieldProps & {
  maskOptions: MaskOptions
  correctionFn?: (value: string, cursor: number | null) => string
}

const InputFieldWithMask = forwardRef<HTMLInputElement, InputFieldWithMaskProps>(
  ({ maskOptions, correctionFn, onChange, value, ...props }, ref) => {
    const maskRef = useMask(maskOptions)
    const mergedRefs = useMergeRefs([maskRef, ref])

    // Перенос курсора в конец строки, когда `value` придет от react-datepicker.
    useEffect(() => {
      const inputElement = maskRef.current

      // Перемещаем курсор, только если инпут НЕ в фокусе (т.е. изменение пришло не от пользователя).
      if (inputElement && value && document.activeElement !== inputElement) {
        requestAnimationFrame(() => {
          const endPosition = inputElement.value.length
          inputElement.setSelectionRange(endPosition, endPosition)
        })
      }
    }, [value, maskRef])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Логика для ручной коррекции ввода.
        if (correctionFn) {
          const input = e.target
          const originalValue = input.value
          const originalCursorPosition = input.selectionStart

          const correctedValue = correctionFn(originalValue, originalCursorPosition)

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
        }

        // Вызываем оригинальный onChange, если он передан
        onChange?.(e)
      },
      [onChange, correctionFn],
    )

    return <InputField {...props} value={value} ref={mergedRefs} onChange={handleChange} />
  },
)

export default InputFieldWithMask
