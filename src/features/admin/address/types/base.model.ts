import type { Address } from "./address"

export interface AddressBase {
  street: string
  cityName: string
  countryName: string
  postalCode?: string

  isPrimary: boolean
  type: Address
  note?: string
}
