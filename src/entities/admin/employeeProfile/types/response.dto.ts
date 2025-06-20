import type { EmployeeProfileBase } from '@/entities/admin/employeeProfile/types/base.model'
import type { Timestamps } from '@/types/common'

export interface EmployeeProfileResponse extends EmployeeProfileBase {}

export interface EmployeeProfileDetailResponse extends EmployeeProfileResponse, Timestamps {}
