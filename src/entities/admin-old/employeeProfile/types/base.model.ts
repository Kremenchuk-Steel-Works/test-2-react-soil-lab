import type { EmploymentStatus } from '@/entities/admin-old/employeeProfile/types/employmentStatus'

export interface EmployeeProfileBase {
  employeeNumber?: string
  hiredAt: string
  employmentStatus: EmploymentStatus
}
