import Button from "../button/Button"
import Checkbox from "../checkbox/Checkox"
import InputField from "../input-field/InputField"
import ReactSelect, { type Option } from "../select/ReactSelect"
import Select from "../select/Select"
import { type Props as SelectProps } from "react-select"
import { withError } from "./WithError"
import InputDateField from "../input-field/InputDateField"
import { FileUpload } from "../file-upload/FileUpload"
import { SelectVirtualized } from "../select/VirtualizedSelect"

export const InputFieldWithError = withError(InputField)
export const InputDateFieldWithError = withError(InputDateField)

export const ButtonWithError = withError(Button)

export const SelectWithError = withError(Select)
export const ReactSelectWithError =
  withError<SelectProps<Option, false>>(ReactSelect)
export const ReactSelectMultiWithError =
  withError<SelectProps<Option, true>>(ReactSelect)

export const SelectVirtualizedWithError = withError(SelectVirtualized)

export const CheckboxWithError = withError(Checkbox)

export const FileUploadWithError = withError(FileUpload)
