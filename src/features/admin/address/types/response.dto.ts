import type { AddressType } from "./address"

export interface AddressResponse {
  street: string
  cityName: string
  countryName: string
  postalCode: string | undefined
  isPrimary: boolean
  type: AddressType
  note: string | undefined
  id: string
  createdAt: string
  updatedAt: string
}
