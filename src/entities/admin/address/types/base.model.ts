import type { Address } from "./address"

export interface AddressBase {
  street: string
  postalCode?: string
  type: Address
  isPrimary: boolean
  note?: string
}
