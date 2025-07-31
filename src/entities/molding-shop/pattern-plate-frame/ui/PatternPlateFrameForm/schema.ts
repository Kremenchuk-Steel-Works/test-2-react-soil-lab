import { z } from 'zod'
import { patternPlateFrameStatusOptions } from '@/entities/molding-shop/pattern-plate-frame/model/status'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const patternPlateFrameFormSchema = z.object({
  blueprintNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.enum(toZodEnumValues(patternPlateFrameStatusOptions)),
})

export type PatternPlateFrameFormFields = z.infer<typeof patternPlateFrameFormSchema>
