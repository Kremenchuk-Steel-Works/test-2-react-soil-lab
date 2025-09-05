import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { loginBaseFormSchema } from '@/entities/auth/login/ui/form/schema'

export const loginFormSchema = loginBaseFormSchema

export type LoginFormFields = z.infer<typeof loginFormSchema>

export const loginFormDefaultValues: DeepPartial<LoginFormFields> = {}
