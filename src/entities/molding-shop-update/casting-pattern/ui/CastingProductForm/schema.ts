import { z } from 'zod'
import { castingPatternStatusOptions } from '@/entities/molding-shop/casting-pattern/model/status'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const castingPatternFormSchema = z.object({
  castingProductId: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.enum(toZodEnumValues(castingPatternStatusOptions)),
})

export type CastingPatternFormFields = z.infer<typeof castingPatternFormSchema>
