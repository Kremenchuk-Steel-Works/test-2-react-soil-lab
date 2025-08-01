import type { CityBase } from '@/entities/admin/city/types/base.model'
import type { CountryShortResponse } from '@/entities/admin/country/types/response.dto'
import type { SoftArchiveStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface CityLookupResponse extends CityBase {
  id: number
}

export interface CityShortResponse extends CityBase {
  id: number
}

export interface CityResponse extends CityBase {
  id: number
  countryId: number
}

export interface CityDetailResponse extends CityBase, Timestamps, SoftArchiveStatusMixin {
  id: number
  country: CountryShortResponse
}

export interface CityListItemResponse extends CityBase, SoftArchiveStatusMixin {
  id: number
  countryName: string
}

export type CityListResponse = PaginatedListResponse<CityShortResponse>
