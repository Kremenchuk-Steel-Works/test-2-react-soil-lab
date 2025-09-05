import type { PositionBase } from '@/entities/admin-old/positions/types/base.model'
import type { SoftArchiveStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface PositionLookupResponse {
  id: string
  name: string
}

export interface PositionShortResponse {
  id: string
  name: string
}

export interface PositionResponse extends PositionBase {
  id: string
}

export interface PositionDetailResponse
  extends PositionResponse,
    Timestamps,
    SoftArchiveStatusMixin {}

export interface PositionListItemResponse extends PositionResponse, SoftArchiveStatusMixin {}

export type PositionListResponse = PaginatedListResponse<PositionListItemResponse>
