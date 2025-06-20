import type { Accept } from 'react-dropzone'

interface FilePreset {
  accept: Accept
  maxSize: number
}

export const fileTypePresets = {
  document: {
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024,
  },
  image: {
    accept: {
      'image/*': [],
    },
    maxSize: 10 * 1024 * 1024,
  },
} satisfies Record<string, FilePreset>

export type FileTypePreset = keyof typeof fileTypePresets
