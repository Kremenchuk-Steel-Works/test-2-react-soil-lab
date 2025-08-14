import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import { FileUpload } from '@/shared/ui/file-upload/FileUpload'
import { DateTimePicker } from '@/shared/ui/input-field/DateTime/DateTimePicker'
import InputField from '@/shared/ui/input-field/InputField'
import TextareaField from '@/shared/ui/input-field/TextareaField'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import ReactSelect from '@/shared/ui/select/ReactSelect'
import Select from '@/shared/ui/select/Select'
import { withErrorOld } from '@/shared/ui/with-error/WithErrorOld'

export const InputFieldWithError = withErrorOld(InputField)
export const TextAreaFieldWithError = withErrorOld(TextareaField)

export const DateTimePickerWithError = withErrorOld(DateTimePicker)

export const ButtonWithError = withErrorOld(Button)

export const SelectWithError = withErrorOld(Select)
export const ReactSelectWithError = withErrorOld(ReactSelect)

export const CheckboxWithError = withErrorOld(Checkbox)

export const FileUploadWithError = withErrorOld(FileUpload)

export const DynamicFieldArrayWithError = withErrorOld(DynamicFieldArray)
