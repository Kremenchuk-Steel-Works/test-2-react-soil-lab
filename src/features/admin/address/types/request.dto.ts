import type { AddressType } from "./address"

export interface AddressCreateRequest {
  street: string
  cityName: string
  countryName: string
  postalCode: string | null
  isPrimary: boolean
  type: AddressType
  note: string | null
  parentId: string
}

export interface AddressOperationRequest {
  action: "create" | "update" | "delete"
  data?: AddressCreateRequest | AddressUpdateRequest | null
  id?: string | null
}

export interface AddressUpdateRequest {
  street?: string | null
  cityName?: string | null
  countryName?: string | null
  postalCode?: string | null
  isPrimary?: boolean | null
  type?: AddressType | null
  note?: string | null
}
