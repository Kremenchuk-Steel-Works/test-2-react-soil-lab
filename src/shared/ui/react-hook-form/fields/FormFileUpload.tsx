import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import { fileTypePresets, type FileTypePreset } from '@/shared/ui/file-upload/filePresets'
import { FileUpload, type FileUploadProps } from '@/shared/ui/file-upload/FileUpload'
import { WithError } from '@/shared/ui/with-error/WithError'

type FormFileUploadProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = Omit<
  FileUploadProps,
  'acceptedFiles' | 'onFilesChange'
> & {
  field: ControllerRenderProps<TFieldValues, TName>
  fieldState: ControllerFieldState
  fileType?: FileTypePreset
  errorMessage?: string
}

const FormFileUpload = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
  field,
  fieldState: _fieldState,
  fileType,
  multiple = false,
  errorMessage,
  ...rest
}: FormFileUploadProps<TFieldValues, TName>) => {
  void _fieldState

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
