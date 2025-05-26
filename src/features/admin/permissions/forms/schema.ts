import { z } from "zod"

export const permissionsSchema = z.object({
  name: z.string().nonempty(),
  desciption: z.string().optional(),
  departmentId: z.string().nonempty(),
})

export type PermissionsFormFields = z.infer<typeof permissionsSchema>
