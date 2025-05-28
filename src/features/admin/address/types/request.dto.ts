import type { AddressType } from "./address"

export interface AddressCreateRequest {
  street: string
  cityName: string
  countryName: string
  postalCode: string | undefined
  isPrimary: boolean
  type: AddressType
  note: string | undefined
  parentId: string
}

export interface AddressOperationRequest {
  action: "create" | "update" | "delete"
  data?: AddressCreateRequest | AddressUpdateRequest | undefined
  id?: string | undefined
}

export interface AddressUpdateRequest {
  street?: string | undefined
  cityName?: string | undefined
  countryName?: string | undefined
  postalCode?: string | undefined
  isPrimary?: boolean | undefined
  type?: AddressType | undefined
  note?: string | undefined
}
