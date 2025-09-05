import z from 'zod'
import { FR_LOGIN as FR } from '@/entities/auth/login/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const loginBaseFormSchema = z.object({
  [FR.email.key]: zn(z.string().email()),
  [FR.password.key]: zn(z.string()),
  [FR.rememberMe.key]: zn(z.boolean()),
})
