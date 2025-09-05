import type { EmployeeProfileBase } from '@/entities/admin-old/employeeProfile/types/base.model'
import type { CreateOperationBase, DeleteOperationBase, UpdateOperationBase } from '@/types/common'

export type EmployeeProfileCreateRequest = EmployeeProfileBase
export type EmployeeProfileUpdateRequest = Partial<EmployeeProfileBase>

export type EmployeeProfileCreateOperation = CreateOperationBase<EmployeeProfileCreateRequest>
export type EmployeeProfileUpdateOperation = UpdateOperationBase<EmployeeProfileUpdateRequest>
export type EmployeeProfileDeleteOperation = DeleteOperationBase

export type EmployeeProfileOperationRequest =
  | EmployeeProfileCreateOperation
  | EmployeeProfileUpdateOperation
  | EmployeeProfileDeleteOperation
