import { z } from 'zod'

export const userSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email().nonempty(),
  rawPassword: z.string().nonempty(),
  isActive: z.boolean().optional(),
  isSuperuser: z.boolean().optional(),
  rolesIds: z.array(z.string()).nullable().optional(),
  permissionsIds: z.array(z.string()).nullable().optional(),
})

export const userUpdateSchema = userSchema.omit({
  rawPassword: true,
})

export type UserFormFields = z.infer<typeof userSchema>
export type UserUpdateFormFields = z.infer<typeof userUpdateSchema>
