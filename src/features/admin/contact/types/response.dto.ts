import type { Timestamps } from "../../../../types/common"
import type { ContactBase } from "./base.model"

export interface ContactResponse extends ContactBase {
  id: string
}

export interface ContactDetailResponse extends ContactResponse, Timestamps {}
