import type { LibraryBase } from '@/entities/library/types/base.model'
import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface LibraryResponse {
  id: string
  shortName: string
}

export interface LibraryDetailResponse extends LibraryBase, Timestamps {
  id: string
  fileName: string
}

export interface LibraryListItemResponse extends LibraryResponse {}

export type LibraryListResponse = PaginatedListResponse<LibraryListItemResponse>
