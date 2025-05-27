import type { EmploymentStatus } from "./employmentStatus"

export interface EmployeeProfileResponse {
  personId: string
  employeeNumber: string | null
  hiredAt: string
  employmentStatus: EmploymentStatus
  createdAt: string
  updatedAt: string
}
