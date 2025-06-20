import type { EmployeeProfileBase } from '@/entities/admin/employeeProfile/types/base.model'

export interface EmployeeProfileCreateRequest extends EmployeeProfileBase {}

export interface EmployeeProfileUpdateRequest extends Partial<EmployeeProfileBase> {}
