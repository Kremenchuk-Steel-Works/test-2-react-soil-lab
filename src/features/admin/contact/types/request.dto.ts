import type { ContactType } from "./contact"

export interface ContactCreateRequest {
  isPrimary: boolean
  type: ContactType
  value: string
  note: string | null
  parentId: string
}

export interface ContactOperationRequest {
  action: "create" | "update" | "delete"
  data?: ContactCreateRequest | ContactUpdateRequest | null
  id?: string | null
}

export interface ContactUpdateRequest {
  isPrimary?: boolean | null
  type?: ContactType | null
  value?: string | null
  note?: string | null
}
