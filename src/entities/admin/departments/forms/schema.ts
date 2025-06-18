import { z } from "zod"

export const departmentsSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type DepartmentsFormFields = z.infer<typeof departmentsSchema>
