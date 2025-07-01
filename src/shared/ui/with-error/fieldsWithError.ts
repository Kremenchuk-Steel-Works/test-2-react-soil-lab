import { type Props as SelectProps } from 'react-select'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkox'
import { FileUpload } from '@/shared/ui/file-upload/FileUpload'
import InputDateField from '@/shared/ui/input-field/InputDateField'
import InputField from '@/shared/ui/input-field/InputField'
import ReactSelect, { type Option } from '@/shared/ui/select/ReactSelect'
import Select from '@/shared/ui/select/Select'
import { withError } from '@/shared/ui/with-error/WithError'

export const InputFieldWithError = withError(InputField)
export const InputDateFieldWithError = withError(InputDateField)

export const ButtonWithError = withError(Button)

export const SelectWithError = withError(Select)
export const ReactSelectWithError = withError<SelectProps<Option, false>>(ReactSelect)
export const ReactSelectMultiWithError = withError<SelectProps<Option, true>>(ReactSelect)

export const CheckboxWithError = withError(Checkbox)

export const FileUploadWithError = withError(FileUpload)
