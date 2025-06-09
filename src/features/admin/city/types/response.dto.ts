import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { CountryShortResponse } from "../../country/types/response.dto"
import type { CityBase } from "./base.model"

export interface CityResponse extends CityBase {
  id: number
  countryId: number
}

export interface CityDetailResponse extends CityBase, Timestamps {
  id: number
  country: CountryShortResponse
}

export interface CityLookupResponse extends CityBase {
  id: number
  countryId: number
}

export interface CityShortResponse extends CityBase {
  id: number
}

export type CityListResponse = PaginatedListResponse<CityShortResponse>
