import type { PaginatedListResponse } from "../../../../types/pagination.types"

export interface PositionResponse {
  name: string
  description: string
  id: string
  createdAt: string
  updatedAt: string
}

export type PositionListResponse = PaginatedListResponse<PositionResponse>
