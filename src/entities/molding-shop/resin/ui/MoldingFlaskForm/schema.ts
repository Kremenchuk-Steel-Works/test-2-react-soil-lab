import { z } from 'zod'
import { resinComponentOptions } from '@/entities/molding-shop/resin/model/component'
import { resinTypeOptions } from '@/entities/molding-shop/resin/model/type'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const resinFormSchema = z.object({
  type: z.enum(toZodEnumValues(resinTypeOptions)),
  brand: z.string().optional(),
  name: z.string().optional(),
  component: z.enum(toZodEnumValues(resinComponentOptions)),
  serialNumber: z.string().optional(),
})

export type ResinFormFields = z.infer<typeof resinFormSchema>
