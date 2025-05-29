import type { ContactType } from "./contact"

export interface ContactBase {
  isPrimary: boolean
  type: ContactType
  value: string
  note?: string
}
