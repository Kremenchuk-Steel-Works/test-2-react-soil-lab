import { z } from "zod"

export const rolesSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
})

export type RolesFormFields = z.infer<typeof rolesSchema>
