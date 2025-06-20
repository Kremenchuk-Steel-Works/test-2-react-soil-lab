import type { Address } from '@/entities/admin/address/types/address'

export interface AddressBase {
  street: string
  postalCode?: string
  type: Address
  isPrimary: boolean
  note?: string
}
