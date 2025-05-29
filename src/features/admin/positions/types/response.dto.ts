import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { PositionBase } from "./base.model"

export interface PositionResponse extends PositionBase {
  id: string
}

export interface PositionDetailResponse extends PositionResponse, Timestamps {}

export interface PositionShortResponse extends PositionResponse {}

export type PositionListResponse = PaginatedListResponse<PositionShortResponse>
