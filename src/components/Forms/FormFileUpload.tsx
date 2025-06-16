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

  let acceptedFiles: File[] = []
  if (field.value) {
    acceptedFiles = Array.isArray(field.value) ? field.value : [field.value]
  }

  return (
    <FileUploadWithError
      {...rest}
      multiple={multiple}
      accept={rest.accept || preset?.accept}
      maxSize={rest.maxSize || preset?.maxSize}
      acceptedFiles={acceptedFiles}
      onFilesChange={(files: File[]) => {
        field.onChange(multiple ? files : files[0] || null)
      }}
      errorMessage={errorMessage || fieldState.error?.message}
    />
  )
}

export default FormFileUpload
