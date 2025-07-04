import type { LibraryBase } from '@/entities/library/types/base.model'

export interface LibraryCreateRequest extends LibraryBase {
  file: File
}

export interface LibraryUpdateRequest extends Partial<LibraryCreateRequest> {}
