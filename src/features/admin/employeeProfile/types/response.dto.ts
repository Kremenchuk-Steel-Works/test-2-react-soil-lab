import type { EmploymentStatus } from "./employmentStatus"

export interface EmployeeProfileResponse {
  personId: string
  employeeNumber: string | undefined
  hiredAt: string
  employmentStatus: EmploymentStatus
  createdAt: string
  updatedAt: string
}
