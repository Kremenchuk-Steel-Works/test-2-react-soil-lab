import type { AddressBase } from '@/entities/admin-old/address/types/base.model'
import type { CreateOperationBase, DeleteOperationBase, UpdateOperationBase } from '@/types/common'

export interface AddressCreateRequest extends AddressBase {
  cityId: number
}

export interface AddressUpdateRequest extends Partial<AddressBase> {
  cityId?: number
}

export type AddressCreateOperation = CreateOperationBase<AddressCreateRequest>
export type AddressUpdateOperation = UpdateOperationBase<AddressUpdateRequest>
export type AddressDeleteOperation = DeleteOperationBase

export type AddressOperationRequest =
  | AddressCreateOperation
  | AddressUpdateOperation
  | AddressDeleteOperation
