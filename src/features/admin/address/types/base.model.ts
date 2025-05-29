import type { AddressType } from "./address"

export interface AddressBase {
  street: string
  cityName: string
  countryName: string
  postalCode?: string

  isPrimary: boolean
  type: AddressType
  note?: string
}
