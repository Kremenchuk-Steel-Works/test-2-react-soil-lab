import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { CityResponse } from "../../city/types/response.dto"
import type { OrganizationResponse } from "../../organizations/types/response.dto"

export interface CountryResponse {
  code: string
  code3: string | null
  numericCode: string | null
  name: string
  nameLocal: string
  id: number
  cities: CityResponse[]
  organizations: OrganizationResponse[]
  createdAt: string
  updatedAt: string
}

export interface CountryListItemResponse {
  id: number
  name: string | null
  nameLocal: string | null
}

export type CountryListResponse = PaginatedListResponse<CountryListItemResponse>
