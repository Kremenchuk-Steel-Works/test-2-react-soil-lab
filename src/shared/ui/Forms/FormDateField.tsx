import { format } from "date-fns"
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form"
import type { InputDateFieldProps } from "../input-field/InputDateField"
import { InputDateFieldWithError } from "../with-error/fieldsWithError"

type FormDateFieldProps = Omit<
  InputDateFieldProps,
  "value" | "onChange" | "onBlur" | "ref"
> & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  stringFormat?: string
  errorMessage?: string
}

const FormDateField = ({
  field,
  fieldState,
  stringFormat = "yyyy-MM-dd",
  errorMessage,
  ...rest
}: FormDateFieldProps) => {
  return (
    <InputDateFieldWithError
      {...rest}
      value={field.value ? new Date(field.value) : undefined}
      onChange={(date: Date | null) => {
        field.onChange(date ? format(date, stringFormat) : null)
      }}
      onBlur={field.onBlur}
      ref={field.ref}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormDateField
