import type { ContactBase } from '@/entities/admin/contact/types/base.model'
import type { CreateOperationBase, DeleteOperationBase, UpdateOperationBase } from '@/types/common'

export interface ContactCreateRequest extends ContactBase {}

export interface ContactUpdateRequest extends Partial<ContactBase> {}

export type ContactCreateOperation = CreateOperationBase<ContactCreateRequest>
export type ContactUpdateOperation = UpdateOperationBase<ContactUpdateRequest>
export type ContactDeleteOperation = DeleteOperationBase

export type ContactOperationRequest =
  | ContactCreateOperation
  | ContactUpdateOperation
  | ContactDeleteOperation
