import { z } from 'zod'

export const rolesSchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  description: z.string().nullable().optional(),
  permissionIds: z.array(z.string()).nullable().optional(),
})

export type RolesFormFields = z.infer<typeof rolesSchema>
