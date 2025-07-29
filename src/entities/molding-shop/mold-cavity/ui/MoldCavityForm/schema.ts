import { z } from 'zod'
import { moldCoreSchema } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'

export const moldCavitySchema = z.object({
  castingPatternId: z.string().optional(),
  serialNumber: z.string().optional(),
  isFunctional: z.boolean().optional(),
  moldCores: z.array(moldCoreSchema),
})

export type MoldCavityFormFields = z.infer<typeof moldCavitySchema>

// Default value
export const moldCavityDefault: MoldCavityFormFields = {
  castingPatternId: undefined,
  serialNumber: '',
  isFunctional: true,
  moldCores: [],
}
