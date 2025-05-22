import Button from "../Button/Button"
import InputField from "../InputField/InputField"
import Select from "../Select/Select"
import { withError } from "./WithError"

export const InputFieldWithError = withError(InputField)
export const ButtonWithError = withError(Button)
export const SelectWithError = withError(Select)
