import type { Contact } from "./contact"

export interface ContactBase {
  type: Contact
  value: string
  isPrimary: boolean
  note?: string
}
