import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CircleMinus, FileArchive, File as FileIcon, FileText, UploadCloud, X } from 'lucide-react'
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone'
import { twMerge } from 'tailwind-merge'
import { logger } from '@/shared/lib/logger'

// --- Props and Utils (без изменений) ---
export interface FileUploadProps {
  label: string
  onFilesChange: (files: File[]) => void
  acceptedFiles: File[]
  multiple?: boolean
  accept?: Accept
  maxSize?: number
}
const generateFileId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`
const processAndRenameFiles = (newFiles: File[], existingFiles: File[]): File[] => {
  const existingFileNames = new Set(existingFiles.map((file) => file.name))
  return newFiles.map((file) => {
    let newName = file.name
    if (existingFileNames.has(newName)) {
      const dotIndex = file.name.lastIndexOf('.')
      const baseName = dotIndex > -1 ? file.name.substring(0, dotIndex) : file.name
      const extension = dotIndex > -1 ? file.name.substring(dotIndex) : ''
      let counter = 1
      do {
        newName = `${baseName}(${counter})${extension}`
        counter++
      } while (existingFileNames.has(newName))
    }
    existingFileNames.add(newName)
    return new File([file], newName, {
      type: file.type,
      lastModified: file.lastModified,
    })
  })
}

// --- FileChip (без изменений) ---
const FileChip: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    let objectUrl: string | null = null
    if (file.type.startsWith('image/')) {
      objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const getIcon = () => {
    if (preview)
      return (
        <img
          src={preview}
          alt={file.name}
          className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
        />
      )
    if (file.type.startsWith('text/')) return <FileText className="h-5 w-5" />
    if (file.type.includes('zip') || file.type.includes('archive'))
      return <FileArchive className="h-5 w-5" />
    return <FileIcon className="h-5 w-5" />
  }

  return (
    <div className="pointer-events-auto flex max-w-full min-w-0 items-center gap-2 overflow-hidden rounded-full bg-gray-200 py-0.5 pr-1 pl-2 text-sm text-gray-800 dark:bg-gray-600 dark:text-gray-100">
      {getIcon()}
      <span className="min-w-0 flex-1 truncate">{file.name}</span>
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="flex-shrink-0 rounded-full p-0.5 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-gray-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// --- Основной компонент ---
export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFilesChange,
  acceptedFiles,
  multiple = false,
  accept,
  maxSize,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      // Всегда сбрасываем состояние перетаскивания после дропа
      setIsDragging(false)

      // Принятые файлы
      if (accepted.length > 0) {
        logger.debug('Accepted:', accepted)
        if (!multiple) {
          onFilesChange(processAndRenameFiles(accepted, []))
          return
        }
        const processedFiles = processAndRenameFiles(accepted, acceptedFiles)
        onFilesChange([...acceptedFiles, ...processedFiles])
      }
      // Отклоненные файлы
      if (rejected.length > 0) {
        logger.warn('Rejected:', rejected)
      }
    },
    [multiple, acceptedFiles, onFilesChange],
  )

  const handleFileRemove = (fileToRemove: File) => {
    onFilesChange(acceptedFiles.filter((file) => file !== fileToRemove))
  }

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    multiple,
    accept,
    maxSize,
  })

  const hasFiles = acceptedFiles.length > 0

  const containerClassName = useMemo(() => {
    const baseClasses =
      'peer relative flex w-full items-start rounded-md border bg-gray-50 px-4 pt-5 pb-2 text-base text-gray-900 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-50 min-h-[54px]'
    const stateClasses = {
      default:
        'cursor-pointer border-gray-300 hover:border-gray-400 dark:border-gray-600 focus:ring-blue-500',
      active: 'cursor-pointer border-blue-500 focus:ring-blue-500',
      accept: 'cursor-pointer border-green-500 focus:ring-green-500',
      reject: 'cursor-not-allowed border-red-500 focus:ring-red-500',
    }

    if (isDragging) {
      if (isDragAccept) return twMerge(baseClasses, stateClasses.accept)
      if (isDragReject) return twMerge(baseClasses, stateClasses.reject)
      return twMerge(baseClasses, stateClasses.active)
    }

    return twMerge(baseClasses, stateClasses.default)
  }, [isDragging, isDragAccept, isDragReject])

  const labelClassName = useMemo(() => {
    const shouldFloat = hasFiles || isDragging
    return twMerge(
      'pointer-events-none absolute left-4 inline-block w-full truncate pr-12 transition-all',
      shouldFloat ? 'top-1 text-sm' : 'top-3.5 text-base',
      hasFiles ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-400',
      'peer-focus:text-blue-500',
    )
  }, [hasFiles, isDragging])

  return (
    <div className="w-full">
      <div className="relative">
        <div {...getRootProps({ className: containerClassName })}>
          <input {...getInputProps()} />

          {hasFiles && (
            <div
              className={twMerge(
                'mt-1 flex w-full flex-wrap gap-2 pr-8',
                isDragging && 'pointer-events-none',
              )}
            >
              {acceptedFiles.map((file) => (
                <FileChip
                  key={generateFileId(file)}
                  file={file}
                  onRemove={() => handleFileRemove(file)}
                />
              ))}
            </div>
          )}

          {isDragging && (
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-row items-center justify-center rounded-md bg-gray-900/60 backdrop-blur-sm">
              {isDragReject ? (
                <>
                  <CircleMinus size={22} className="mr-2 text-red-400" />
                  <span className="font-semibold text-red-300">Непідтримуваний тип файлу</span>
                </>
              ) : (
                <span className="font-semibold text-white">Відпустіть для завантаження...</span>
              )}
            </div>
          )}
        </div>

        <label className={labelClassName}>{label}</label>

        <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
          <UploadCloud
            size={20}
            className={`${
              hasFiles
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-500/50 dark:text-gray-400/50'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
