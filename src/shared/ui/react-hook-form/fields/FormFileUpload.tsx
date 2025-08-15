import type { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'
import { fileTypePresets, type FileTypePreset } from '@/shared/ui/file-upload/filePresets'
import { FileUpload, type FileUploadProps } from '@/shared/ui/file-upload/FileUpload'
import { WithError } from '@/shared/ui/with-error/WithError'

type FormFileUploadProps = Omit<FileUploadProps, 'acceptedFiles' | 'onFilesChange'> & {
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
    <WithError errorMessage={errorMessage}>
      <FileUpload
        {...rest}
        multiple={multiple}
        accept={rest.accept || preset?.accept}
        maxSize={rest.maxSize || preset?.maxSize}
        acceptedFiles={acceptedFiles}
        onFilesChange={(files: File[]) => {
          field.onChange(multiple ? files : files[0] || null)
        }}
      />
    </WithError>
  )
}

export default FormFileUpload
