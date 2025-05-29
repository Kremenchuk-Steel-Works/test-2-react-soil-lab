import type { Timestamps } from "../../../../types/common"
import type { AddressBase } from "./base.model"

export interface AddressResponse extends AddressBase {
  id: string
}

export interface AddressDetailResponse extends AddressResponse, Timestamps {}
