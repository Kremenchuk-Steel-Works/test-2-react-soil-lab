import type { EmploymentStatus } from "./employmentStatus"

export interface EmployeeProfileCreateRequest {
  personId: string
  employeeNumber: string | null
  hiredAt: string
  employmentStatus: EmploymentStatus
}

export interface EmployeeProfileUpdateRequest {
  employeeNumber?: string | null
  hiredAt?: string | null
  employmentStatus?: EmploymentStatus | null
}
