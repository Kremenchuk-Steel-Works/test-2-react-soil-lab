import { z } from "zod"
import { employeeProfileOptions } from '@/entities/admin/employeeProfile/types/employmentStatus'
import { toZodEnumValues } from '@/shared/lib/zod'

export const employeeProfileSchema = z.object({
  employeeNumber: z.string().optional(),
  hiredAt: z.string().nonempty(),
  employmentStatus: z.enum(toZodEnumValues(employeeProfileOptions)),
})

export type EmployeeProfileFormFields = z.infer<typeof employeeProfileSchema>
