import type { ContactBase } from '@/entities/admin/contact/types/base.model'
import type { CreateOperationBase, DeleteOperationBase, UpdateOperationBase } from '@/types/common'

export type ContactCreateRequest = ContactBase
export type ContactUpdateRequest = Partial<ContactBase>

export type ContactCreateOperation = CreateOperationBase<ContactCreateRequest>
export type ContactUpdateOperation = UpdateOperationBase<ContactUpdateRequest>
export type ContactDeleteOperation = DeleteOperationBase

export type ContactOperationRequest =
  | ContactCreateOperation
  | ContactUpdateOperation
  | ContactDeleteOperation
