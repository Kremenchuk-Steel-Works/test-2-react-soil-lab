import type { EmploymentStatus } from "./employmentStatus"

export interface EmployeeProfileBase {
  employeeNumber?: string
  hiredAt: string
  employmentStatus: EmploymentStatus
}
