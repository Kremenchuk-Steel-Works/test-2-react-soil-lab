import type { AddressType } from "./address"

export interface AddressResponse {
  street: string
  cityName: string
  countryName: string
  postalCode: string | null
  isPrimary: boolean
  type: AddressType
  note: string | null
  id: string
  createdAt: string
  updatedAt: string
}
