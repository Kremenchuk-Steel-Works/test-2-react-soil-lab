import { z } from "zod"

export const permissionsSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  departmentId: z.string().nonempty(),
})

export type PermissionsFormFields = z.infer<typeof permissionsSchema>
