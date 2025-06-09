import type { Timestamps } from "../../../../types/common"
import type { Address } from "./address"
import type { AddressBase } from "./base.model"

export interface AddressResponse {
  id: string
  cityId: number
  type: Address
  isPrimary: boolean
}

export interface AddressDetailResponse extends AddressBase, Timestamps {
  id: string
  cityId: number
}
