import type { ContactType } from "./contact"

export interface ContactResponse {
  isPrimary: boolean
  type: ContactType
  value: string
  note: string | undefined
  id: string
  createdAt: string
  updatedAt: string
}
