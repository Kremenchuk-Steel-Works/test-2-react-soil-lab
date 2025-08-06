import { z } from 'zod'
import { moldCoreFormSchema } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'

export const moldCavityFormSchema = z.object({
  castingPatternId: z.string().default(''),
  serialNumber: z.string().default(''),
  moldCores: z.array(moldCoreFormSchema).default([]),
  isFunctional: z.boolean().default(true),
})

export type MoldCavityFormFields = z.infer<typeof moldCavityFormSchema>
export const moldCavityFormDefaultValues: MoldCavityFormFields = moldCavityFormSchema.parse({})
