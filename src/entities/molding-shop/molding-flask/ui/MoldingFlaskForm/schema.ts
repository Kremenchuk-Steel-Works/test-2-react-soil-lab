import { z } from 'zod'
import { moldingFlaskStatusOptions } from '@/entities/molding-shop/molding-flask/model/status'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const moldingFlaskFormSchema = z.object({
  blueprintNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.enum(toZodEnumValues(moldingFlaskStatusOptions)),
})

export type MoldingFlaskFormFields = z.infer<typeof moldingFlaskFormSchema>
