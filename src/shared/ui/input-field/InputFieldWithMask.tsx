import { forwardRef, useCallback } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { useMask } from '@react-input/mask'
import { getCorrectedDateString } from '@/shared/lib/react-input-mask/сorrected-date-string'
import InputField, { type InputFieldProps } from '@/shared/ui/input-field/InputField'

// Расширяем пропсы, чтобы включить стандартные атрибуты инпута, включая onChange
type InputFieldWithMaskProps = InputFieldProps & React.InputHTMLAttributes<HTMLInputElement>

const InputFieldWithMask = forwardRef<HTMLInputElement, InputFieldWithMaskProps>(
  ({ id, name, label, onChange, ...props }, ref) => {
    const inputRef = useMask({
      mask: '__.__.____',
      replacement: { _: /\d/ },
      showMask: false,
      separate: true,
    })

    const mergedRefs = useMergeRefs([inputRef, ref])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target
        const originalValue = input.value
        const originalCursorPosition = input.selectionStart

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

export default InputFieldWithMask
