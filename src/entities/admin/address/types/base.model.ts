import type { Address } from '@/entities/admin/address/types/address'

export interface AddressBase {
  type: Address
  fullAddress: string
  postalCode?: string
  note?: string

  isPrimary: boolean
}
