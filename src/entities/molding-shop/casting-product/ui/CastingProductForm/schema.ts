import { z } from 'zod'
import { castingProductTypeOptions } from '@/entities/molding-shop/casting-product/model/type'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const castingProductFormSchema = z.object({
  type: z.enum(toZodEnumValues(castingProductTypeOptions)),
  name: z.string().optional(),
  blueprintNumber: z.string().optional(),
  isCastingManualOnly: z.boolean(),
})

export type CastingProductFormFields = z.infer<typeof castingProductFormSchema>
