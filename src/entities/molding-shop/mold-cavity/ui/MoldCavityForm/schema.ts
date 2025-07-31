import { z } from 'zod'
import { moldCoreFormSchema } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'

export const moldCavityFormSchema = z.object({
  castingPatternId: z.string().optional(),
  serialNumber: z.string().optional(),
  isFunctional: z.boolean().optional().default(true),
  moldCores: z.array(moldCoreFormSchema).default([]),
  experimentIds: z.array(z.string()).optional(),
})

export type MoldCavityFormFields = z.infer<typeof moldCavityFormSchema>
export const moldCavityFormDefaultValues: MoldCavityFormFields = moldCavityFormSchema.parse({})
