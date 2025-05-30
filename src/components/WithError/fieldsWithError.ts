import Button from "../Button/Button"
import Checkbox from "../Checkbox/Checkox"
import InputField from "../InputField/InputField"
import ReactSelect, { type Option } from "../Select/ReactSelect"
import Select from "../Select/Select"
import { type Props as SelectProps } from "react-select"
import { withError } from "./WithError"

export const InputFieldWithError = withError(InputField)
export const ButtonWithError = withError(Button)
export const SelectWithError = withError(Select)
export const ReactSelectWithError =
  withError<SelectProps<Option, false>>(ReactSelect)
export const ReactSelectMultiWithError =
  withError<SelectProps<Option, true>>(ReactSelect)
export const CheckboxWithError = withError(Checkbox)
