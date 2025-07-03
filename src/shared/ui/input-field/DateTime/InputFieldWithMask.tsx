// src/components/InputFieldWithMask.tsx

import React, { forwardRef, useCallback } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { useMask, type MaskOptions } from '@react-input/mask'
import InputField, { type InputFieldProps } from '../InputField'

type InputFieldWithMaskProps = InputFieldProps & {
  maskOptions: MaskOptions
  correctionFn: (value: string, cursor: number | null) => string
}

const InputFieldWithMask = forwardRef<HTMLInputElement, InputFieldWithMaskProps>(
  ({ maskOptions, correctionFn, onChange, ...props }, ref) => {
    const inputRef = useMask(maskOptions)
    const mergedRefs = useMergeRefs([inputRef, ref])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (onChange) {
          onChange(e)
        }
      },
      [onChange, correctionFn],
    )

    return <InputField {...props} ref={mergedRefs} onChange={handleChange} />
  },
)

InputFieldWithMask.displayName = 'InputFieldWithMask'

export default InputFieldWithMask
