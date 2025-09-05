import type { AddressBase } from '@/entities/admin-old/address/types/base.model'
import type { Timestamps } from '@/types/common'
import type { CityListItemResponse } from '../../city/types/response.dto'

export interface AddressResponse extends AddressBase {
  id: string
  cityId: number
}

export interface AddressDetailResponse extends AddressBase, Timestamps {
  id: string
  city: CityListItemResponse
}
