import AlertMessage, { AlertType } from "../AlertMessage"
import InputField, { type InputFieldProps } from "./InputField"

type InputFieldWithErrorProps = InputFieldProps & {
  errorMessage?: string
}

const InputFieldWithError: React.FC<InputFieldWithErrorProps> = function ({
  label,
  errorMessage = "",
  ...props
}) {
  return (
    <>
      <InputField label={label} {...props} />
      {errorMessage && (
        <AlertMessage type={AlertType.ERROR} message={errorMessage} />
      )}
    </>
  )
}

export default InputFieldWithError
