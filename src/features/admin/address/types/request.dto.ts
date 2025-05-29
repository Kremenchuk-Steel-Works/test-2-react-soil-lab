import type { AddressBase } from "./base.model"

export interface AddressCreateRequest extends AddressBase {
  associationId: string
  countryId: number
  cityId: number
}

export interface AddressUpdateRequest extends Partial<AddressBase> {
  countryId?: number
  cityId?: number
}

export interface AddressOperationRequest {
  action: "create" | "update" | "delete"
  data?: AddressCreateRequest | AddressUpdateRequest
  id?: string
}
