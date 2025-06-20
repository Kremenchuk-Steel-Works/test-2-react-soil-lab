import type { Timestamps } from '@/types/common'
import type { Address } from '@/entities/admin/address/types/address'
import type { AddressBase } from '@/entities/admin/address/types/base.model'

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
