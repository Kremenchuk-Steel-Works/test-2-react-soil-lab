import { type Props as SelectProps } from 'react-select'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import { FileUpload } from '@/shared/ui/file-upload/FileUpload'
import { DateTimePicker } from '@/shared/ui/input-field/DateTime/DateTimePicker'
import InputField from '@/shared/ui/input-field/InputField'
import ReactSelect, { type Option } from '@/shared/ui/select/ReactSelect'
import Select from '@/shared/ui/select/Select'
import { withError } from '@/shared/ui/with-error/WithError'

export const InputFieldWithError = withError(InputField)

export const DateTimePickerWithError = withError(DateTimePicker)

export const ButtonWithError = withError(Button)

export const SelectWithError = withError(Select)
export const ReactSelectWithError = withError<SelectProps<Option, false>>(ReactSelect)
export const ReactSelectMultiWithError = withError<SelectProps<Option, true>>(ReactSelect)

export const CheckboxWithError = withError(Checkbox)

export const FileUploadWithError = withError(FileUpload)
