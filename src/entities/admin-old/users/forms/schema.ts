import { number, z } from 'zod'

export const userSchema = z.object({
  personId: z.string().nonempty(),
  email: z.string().email().nonempty(),
  rawPassword: z.string().nonempty(),
  isActive: z.boolean(),
  isSuperuser: z.boolean(),
  rolesIds: z.array(number()).optional(),
  permissionsIds: z.array(number()).optional(),
})

export const userUpdateSchema = userSchema.omit({
  rawPassword: true,
})

export type UserFormFields = z.infer<typeof userSchema>
export type UserUpdateFormFields = z.infer<typeof userUpdateSchema>
