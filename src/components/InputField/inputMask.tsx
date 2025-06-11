import { useMask } from "@react-input/mask"
import { forwardRef } from "react"
import type { InputFieldProps } from "./InputField"
import InputField from "./InputField"
import { useMergeRefs } from "@floating-ui/react"

const InputFieldWithMask = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, ...props }, ref) => {
    const inputRef = useMask({
      mask: "дд.мм.рррр",
      replacement: { д: /\d/, м: /\d/, р: /\d/ },
      showMask: false,
      separate: true,
    })

    return (
      <InputField
        {...props}
        label={label}
        ref={useMergeRefs([inputRef, ref])}
      />
    )
  }
)

export default InputFieldWithMask
