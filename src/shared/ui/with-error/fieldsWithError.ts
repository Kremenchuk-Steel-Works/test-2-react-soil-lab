import Button from "../button123/Button"
import Checkbox from "../checkbox123/Checkox"
import InputField from "../input-field/InputField"
import ReactSelect, { type Option } from "../select123/ReactSelect"
import Select from "../select123/Select"
import { type Props as SelectProps } from "react-select"
import { withError } from "./WithError"
import InputDateField from "../input-field/InputDateField"
import { FileUpload } from "../file-upload/FileUpload"
import { SelectVirtualized } from "../select123/VirtualizedSelect"

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
