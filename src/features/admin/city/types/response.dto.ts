import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { CityBase } from "./base.model"

export interface CityResponse extends CityBase {
  id: number
  countryId: number
}

export interface CityDetailResponse extends CityResponse, Timestamps {}

export interface CityShortResponse extends CityBase {
  id: number
}

export type CityListResponse = PaginatedListResponse<CityShortResponse>
