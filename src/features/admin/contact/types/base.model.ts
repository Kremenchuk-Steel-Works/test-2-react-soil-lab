import type { Contact } from "./contact"

export interface ContactBase {
  isPrimary: boolean
  type: Contact
  value: string
  note?: string
}
