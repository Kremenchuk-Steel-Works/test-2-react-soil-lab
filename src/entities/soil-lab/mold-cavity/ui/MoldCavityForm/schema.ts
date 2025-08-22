import type { DeepPartial } from 'react-hook-form'
import { z } from 'zod'
import { moldCoreFormSchema } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const moldCavityFormSchema = z.object({
  id: zn(z.string().optional()),
  castingPatternId: zn(z.string()),
  serialNumber: zn(z.string()),
  moldCores: z.array(moldCoreFormSchema),
  isFunctional: z.boolean(),
})

export type MoldCavityFormFields = z.infer<typeof moldCavityFormSchema>
export const moldCavityFormDefaultValues: DeepPartial<MoldCavityFormFields> = {
  moldCores: [],
  isFunctional: true,
}

export const withMoldCavitiesSchema = z.object({
  moldCavities: z.array(moldCavityFormSchema),
})

export type WithMoldCavitiesFormFields = z.infer<typeof withMoldCavitiesSchema>
