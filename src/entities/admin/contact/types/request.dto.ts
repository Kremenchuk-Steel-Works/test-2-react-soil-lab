import type { ContactBase } from "./base.model"

export interface ContactCreateRequest extends ContactBase {}

export interface ContactUpdateRequest extends Partial<ContactBase> {}

export interface ContactOperationRequest {
  action: "create" | "update" | "delete"
  data?: ContactCreateRequest | ContactUpdateRequest
  id?: string
}
