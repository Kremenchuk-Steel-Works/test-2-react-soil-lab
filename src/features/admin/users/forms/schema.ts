import { z } from "zod"
import optionalObject from "../../../../utils/zodHelpers"

export const usersRolesSchema = z.object({
  roleId: z.string().nonempty(),
})

export const usersPermissionsSchema = z.object({
  permissionId: z.string().nonempty(),
})

export const userSchema = z.object({
  personId: z.string().nonempty(),
  email: z.string().email().nonempty(),
  rawPassword: z.string().nonempty(),
  isActive: z.boolean(),
  isSuperuser: z.boolean(),
  roles: optionalObject(usersRolesSchema),
  permissions: optionalObject(usersPermissionsSchema),
})

export const updateUserSchema = z.object({
  personId: z.string().nonempty(),
  email: z.string().email().nonempty(),
  rawPassword: z.string().optional(),
  isActive: z.boolean(),
  isSuperuser: z.boolean(),
  roles: optionalObject(usersRolesSchema),
  permissions: optionalObject(usersPermissionsSchema),
})

export type UserFormFields = z.infer<typeof userSchema>
export type UpdateUserFormFields = z.infer<typeof updateUserSchema>
