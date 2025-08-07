import type { DeepPartial } from 'react-hook-form'
import { z } from 'zod'
import { moldCoreFormSchema } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'

export const moldCavityFormSchema = z.object({
  castingPatternId: z.string(),
  serialNumber: z.string(),
  moldCores: z.array(moldCoreFormSchema),
  isFunctional: z.boolean(),
})

export type MoldCavityFormFields = z.infer<typeof moldCavityFormSchema>
export const moldCavityFormDefaultValues: DeepPartial<MoldCavityFormFields> = {
  moldCores: [],
  isFunctional: true,
}
