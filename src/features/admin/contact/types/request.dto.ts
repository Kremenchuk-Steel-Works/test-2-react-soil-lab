import type { ContactType } from "./contact"

export interface ContactCreateRequest {
  isPrimary: boolean
  type: ContactType
  value: string
  note: string | undefined
  parentId: string
}

export interface ContactOperationRequest {
  action: "create" | "update" | "delete"
  data?: ContactCreateRequest | ContactUpdateRequest | undefined
  id?: string | undefined
}

export interface ContactUpdateRequest {
  isPrimary?: boolean | undefined
  type?: ContactType | undefined
  value?: string | undefined
  note?: string | undefined
}
