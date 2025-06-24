import type { LibraryBase } from './base.model'

export interface LibraryCreateRequest extends LibraryBase {
  file: File
}

export interface LibraryUpdateRequest extends Partial<LibraryCreateRequest> {}
