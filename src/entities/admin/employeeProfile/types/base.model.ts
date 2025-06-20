import type { EmploymentStatus } from '@/entities/admin/employeeProfile/types/employmentStatus'

export interface EmployeeProfileBase {
  employeeNumber?: string
  hiredAt: string
  employmentStatus: EmploymentStatus
}
