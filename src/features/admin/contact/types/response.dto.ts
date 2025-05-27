import type { ContactType } from "./contact"

export interface ContactResponse {
  isPrimary: boolean
  type: ContactType
  value: string
  note: string | null
  id: string
  createdAt: string
  updatedAt: string
}
