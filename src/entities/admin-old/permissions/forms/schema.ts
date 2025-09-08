import { z } from 'zod'

export const permissionsSchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  description: z.string().optional().nullable(),
})

export type PermissionsFormFields = z.infer<typeof permissionsSchema>
