import type { PositionBase } from '@/entities/admin/positions/types/base.model'
import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface PositionResponse extends PositionBase {
  id: string
}

export interface PositionDetailResponse extends PositionResponse, Timestamps {}

export interface PositionShortResponse extends PositionResponse {}

export interface PositionLookupResponse {
  id: string
  name: string
}

export type PositionListResponse = PaginatedListResponse<PositionShortResponse>
