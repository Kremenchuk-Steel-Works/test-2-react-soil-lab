import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form"
import { FileUploadWithError } from "../WithError/fieldsWithError"
import type { FileUploadProps } from "../ui/FileUpload/FileUpload"
import {
  fileTypePresets,
  type FileTypePreset,
} from "../ui/FileUpload/filePresets"

type FormFileUploadProps = Omit<
  FileUploadProps,
  "acceptedFiles" | "onFilesChange"
> & {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  fileType?: FileTypePreset
  errorMessage?: string
}

const FormFileUpload = ({
  field,
  fieldState,
  fileType,
  multiple = false,
  errorMessage,
  ...rest
}: FormFileUploadProps) => {
  const preset = fileType ? fileTypePresets[fileType] : undefined

  return (
    <FileUploadWithError
      {...rest}
      multiple={multiple}
      accept={rest.accept || preset?.accept}
      maxSize={rest.maxSize || preset?.maxSize}
      acceptedFiles={
        field.value
          ? Array.isArray(field.value)
            ? field.value
            : [field.value]
          : []
      }
      onFilesChange={(files: File[]) => {
        field.onChange(multiple ? files : files[0] || undefined)
      }}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormFileUpload
