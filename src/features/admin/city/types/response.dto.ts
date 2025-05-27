import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { CountryResponse } from "../../country/types/response.dto"

export interface CityResponse {
  name: string
  nameLocal: string
  id: number
  country: CountryResponse
  createdAt: string
  updatedAt: string
}

export interface CityListItemResponse {
  name: string
  nameLocal: string
  id: number
}

export type CityListResponse = PaginatedListResponse<CityListItemResponse>
