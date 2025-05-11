import AlertMessage, { AlertType } from "../AlertMessage"
import Button, { type ButtonProps } from "./Button"

type ButtonWithErrorProps = ButtonProps & {
  errorMessage?: string
}

const ButtonWithError: React.FC<ButtonWithErrorProps> = function ({
  errorMessage = "",
  ...props
}) {
  return (
    <>
      <Button {...props}>{props.children}</Button>
      {errorMessage && (
        <AlertMessage type={AlertType.ERROR} message={errorMessage} />
      )}
    </>
  )
}

export default ButtonWithError
