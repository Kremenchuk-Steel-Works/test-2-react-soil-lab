import type { ContactBase } from '@/entities/admin/contact/types/base.model'
import type { Timestamps } from '@/types/common'

export interface ContactResponse extends ContactBase {
  id: string
}

export interface ContactDetailResponse extends ContactResponse, Timestamps {}
