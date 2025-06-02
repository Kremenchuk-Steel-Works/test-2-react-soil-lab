import { z } from "zod"
import { toZodEnumValues } from "../../../../utils/zodHelpers"
import { employeeProfileOptions } from "../types/employmentStatus"

export const employeeProfileSchema = z.object({
  employeeNumber: z.string().optional(),
  hiredAt: z.string().nonempty(),
  employmentStatus: z.enum(toZodEnumValues(employeeProfileOptions)),
})

export type EmployeeProfileFormFields = z.infer<typeof employeeProfileSchema>
