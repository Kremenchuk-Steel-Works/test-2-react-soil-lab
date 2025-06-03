import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { CityShortResponse } from "../../city/types/response.dto"
import type { CountryBase } from "./base.model"
export interface CountryResponse extends CountryBase {
  id: number
}

export interface CountryDetailResponse extends CountryResponse, Timestamps {
  cities: CityShortResponse[]
}

export interface CountryShortResponse {
  id: number
  code: string
  name: string
  nameLocal: string
}

export type CountryListResponse = PaginatedListResponse<CountryShortResponse>
