import { number, z } from "zod"

export const userSchema = z.object({
  personId: z.string().nonempty(),
  email: z.string().email().nonempty(),
  rawPassword: z.string().nonempty(),
  isActive: z.boolean(),
  isSuperuser: z.boolean(),
  rolesIds: z.array(number()),
  permissionsIds: z.array(number()),
})

export const updateUserSchema = z.object({
  personId: z.string().nonempty(),
  email: z.string().email().nonempty(),
  rawPassword: z.string().optional(),
  isActive: z.boolean(),
  isSuperuser: z.boolean(),
  rolesIds: z.array(number()),
  permissionsIds: z.array(number()),
})

export type UserFormFields = z.infer<typeof userSchema>
export type UpdateUserFormFields = z.infer<typeof updateUserSchema>
