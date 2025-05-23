import { z } from "zod"

export const userSchema = z.object({
  personId: z.string().nonempty("Обязательное поле"),
  email: z
    .string()
    .email("Неверный формат email")
    .nonempty("Обязательное поле"),
  password: z.string().nonempty("Обязательное поле"),
  isActive: z.boolean(),
})

export const updateUserSchema = z.object({
  personId: z.string().nonempty("Обязательное поле"),
  email: z
    .string()
    .email("Неверный формат email")
    .nonempty("Обязательное поле"),
  password: z.string().optional(),
  isActive: z.boolean(),
})

export type UserFormFields = z.infer<typeof userSchema>
export type UpdateUserFormFields = z.infer<typeof updateUserSchema>
