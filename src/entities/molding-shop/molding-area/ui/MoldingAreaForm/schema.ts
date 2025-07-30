import { z } from 'zod'
import { moldingAreaAdditionalOptions } from '@/entities/molding-shop/molding-area/model/additionalOptions'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const moldingAreaFormSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  pressureUnits: z.string().optional(),
  additionalOptions: z.enum(toZodEnumValues(moldingAreaAdditionalOptions)),
})

export type MoldingAreaFormFields = z.infer<typeof moldingAreaFormSchema>
