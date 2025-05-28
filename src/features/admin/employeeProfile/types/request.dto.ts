import type { EmploymentStatus } from "./employmentStatus"

export interface EmployeeProfileCreateRequest {
  personId: string
  employeeNumber: string | undefined
  hiredAt: string
  employmentStatus: EmploymentStatus
}

export interface EmployeeProfileUpdateRequest {
  employeeNumber?: string | undefined
  hiredAt?: string | undefined
  employmentStatus?: EmploymentStatus | undefined
}
