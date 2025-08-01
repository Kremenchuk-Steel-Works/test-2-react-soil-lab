import type { EmployeeProfileBase } from '@/entities/admin/employeeProfile/types/base.model'
import type { CreateOperationBase, DeleteOperationBase, UpdateOperationBase } from '@/types/common'

export interface EmployeeProfileCreateRequest extends EmployeeProfileBase {}

export interface EmployeeProfileUpdateRequest extends Partial<EmployeeProfileBase> {}

export type EmployeeProfileCreateOperation = CreateOperationBase<EmployeeProfileCreateRequest>
export type EmployeeProfileUpdateOperation = UpdateOperationBase<EmployeeProfileUpdateRequest>
export type EmployeeProfileDeleteOperation = DeleteOperationBase

export type EmployeeProfileOperationRequest =
  | EmployeeProfileCreateOperation
  | EmployeeProfileUpdateOperation
  | EmployeeProfileDeleteOperation
