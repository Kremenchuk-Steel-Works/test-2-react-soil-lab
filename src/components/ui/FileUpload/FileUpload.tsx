import React, { useCallback, useMemo, useState } from "react"
import { useDropzone, type Accept, type FileRejection } from "react-dropzone"
import AlertMessage, { AlertType } from "../../AlertMessage"

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void
  multiple?: boolean
  accept?: Accept
  maxSize?: number
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAccepted,
  multiple = false,
  accept,
  maxSize,
}) => {
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Сбрасываем предыдущие ошибки при новом дропе
      setRejectedFiles([])

      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles)
      }
      if (fileRejections.length > 0) {
        setRejectedFiles(fileRejections)
      }
    },
    [onFilesAccepted]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple,
    accept,
    maxSize,
  })

  const containerClassName = useMemo(() => {
    const baseClasses =
      "flex flex-1 flex-col items-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors duration-200 ease-in-out"

    if (isDragActive) {
      return `${baseClasses} border-blue-500 bg-blue-50`
    }
    if (isDragAccept) {
      return `${baseClasses} border-green-500 bg-green-50`
    }
    if (isDragReject) {
      return `${baseClasses} border-red-500 bg-red-50`
    }

    return `${baseClasses} border-gray-300 bg-gray-50 hover:border-gray-400`
  }, [isDragActive, isDragAccept, isDragReject])

  return (
    <div className="w-full">
      <div {...getRootProps({ className: containerClassName })}>
        <input {...getInputProps()} />
        <p className="text-gray-500">
          {isDragActive
            ? "Відпустіть файли для завантаження..."
            : "Перетягніть файли сюди або натисніть"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Максимальний розмір файлу:{" "}
          {maxSize ? `${(maxSize / 1024 / 1024).toFixed(0)}MB` : "Не обмежений"}
        </p>
      </div>

      {rejectedFiles.length > 0 && (
        <ul className="list-disc list-inside text-sm text-red-500 mt-2">
          {rejectedFiles.map(({ file, errors }) => (
            <AlertMessage
              key={file.name}
              type={AlertType.ERROR}
              message={`${file.name} - ${errors
                .map((e) => e.message)
                .join(", ")}`}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
