import type { CityShortResponse } from '@/entities/admin/city/types/response.dto'
import type { CountryBase } from '@/entities/admin/country/types/base.model'
import type { SoftArchiveStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface CountryLookupResponse {
  id: number
  isoAlpha2: string
  name: string
}

export interface CountryShortResponse extends CountryBase {
  id: number
}

export interface CountryResponse extends CountryBase {
  id: number
}

export interface CountryDetailResponse extends CountryResponse, Timestamps, SoftArchiveStatusMixin {
  cities: CityShortResponse[]
}

export interface CountryListItemResponse extends CountryResponse, SoftArchiveStatusMixin {
  cities: CityShortResponse[]
}

export type CountryListResponse = PaginatedListResponse<CountryListItemResponse>
