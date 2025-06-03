import type { AddressBase } from "./base.model"

export interface AddressCreateRequest extends AddressBase {
  cityId: number
}

export interface AddressUpdateRequest extends Partial<AddressBase> {
  cityId?: number
}

export interface AddressOperationRequest {
  action: "create" | "update" | "delete"
  data?: AddressCreateRequest | AddressUpdateRequest
  id?: string
}
