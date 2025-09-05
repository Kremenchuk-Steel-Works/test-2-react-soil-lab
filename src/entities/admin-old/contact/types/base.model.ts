import type { Contact } from '@/entities/admin-old/contact/types/contact'

export interface ContactBase {
  type: Contact
  value: string
  isPrimary: boolean
  note?: string
}
