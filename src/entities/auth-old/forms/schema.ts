import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
  rememberMe: z.boolean(),
})

export type LoginFormFields = z.infer<typeof loginSchema>
