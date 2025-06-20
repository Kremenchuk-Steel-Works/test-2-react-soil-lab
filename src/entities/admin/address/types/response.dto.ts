import type { Address } from '@/entities/admin/address/types/address'
import type { AddressBase } from '@/entities/admin/address/types/base.model'
import type { Timestamps } from '@/types/common'

export interface AddressResponse {
  id: string
  cityId: number
  type: Address
  isPrimary: boolean
}

export interface AddressDetailResponse extends AddressBase, Timestamps {
  id: string
  cityId: number
}
