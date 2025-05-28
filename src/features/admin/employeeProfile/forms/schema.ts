import { z } from "zod"
import { employmentStatuses } from "../../employeeProfile/types/employmentStatus"

export const employeeProfileSchema = z.object({
  employeeNumber: z.string().optional(),
  hiredAt: z.string().nonempty(),
  employmentStatus: z.enum(employmentStatuses),
})

export type EmployeeProfileFormFields = z.infer<typeof employeeProfileSchema>
