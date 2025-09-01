import type { EmployeeProfileBase } from '@/entities/admin/employeeProfile/types/base.model'
import type { Timestamps } from '@/types/common'

export type EmployeeProfileResponse = EmployeeProfileBase

export interface EmployeeProfileDetailResponse extends EmployeeProfileResponse, Timestamps {}
