import { forwardRef, useCallback } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { useMask, type InputMaskProps } from '@react-input/mask'
import { getCorrectedDateString } from '@/shared/lib/react-input-mask/сorrected-date-string'
import InputField, { type InputFieldProps } from '@/shared/ui/input-field/InputField'

// Расширяем пропсы, чтобы включить параметры для маски
type InputFieldWithMaskProps = InputFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    mask: InputMaskProps['mask']
    replacement: InputMaskProps['replacement']
    showMask?: InputMaskProps['showMask']
  }

const InputFieldWithMask = forwardRef<HTMLInputElement, InputFieldWithMaskProps>(
  ({ id, name, label, onChange, mask, replacement, showMask = false, ...props }, ref) => {
    const inputRef = useMask({
      mask,
      replacement,
      showMask,
      separate: true,
    })

    const mergedRefs = useMergeRefs([inputRef, ref])

    // Логика автокорреции даты. Ты можешь расширить ее или сделать отключаемой,
    // если для времени она не нужна. Пока оставляем как есть.
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target
        const originalValue = input.value
        const originalCursorPosition = input.selectionStart

        // Важно: getCorrectedDateString может потребовать доработки для поддержки времени,
        // если в нем есть строгая логика, завязанная на формат dd.MM.yyyy
        const correctedValue = getCorrectedDateString(originalValue, originalCursorPosition)

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

    return (
      <InputField
        {...props}
        id={id}
        name={name}
        label={label}
        ref={mergedRefs}
        onChange={handleChange}
      />
    )
  },
)

InputFieldWithMask.displayName = 'InputFieldWithMask'

export default InputFieldWithMask
