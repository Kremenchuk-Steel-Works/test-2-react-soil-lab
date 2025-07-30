import { z } from 'zod'
import { moldCavitySchema } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import { moldPassportDynamicFieldConfig } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'

const baseSchema = z.object({
  moldingAreaId: z.string().optional(),

  // Dynamic fields (trigger)
  castingTechnologyId: z.string().optional(),

  patternPlateFrameId: z.string().optional(),
  moldingFlaskId: z.string().optional(),

  markingYear: z.number().optional(),

  moldCavities: z.array(moldCavitySchema),

  pressingPressure: z.number().optional(),
  workshopTemperatureCelsius: z.number().optional(),
  moldSequenceInShift: z.number().optional(),
  moldAssemblyTimestamp: z.string().optional(),
  experimentIds: z.array(z.string()).optional(),
  status: z.boolean(),
  notes: z.string().optional(),
})

export const moldPassportSchema = createDynamicSchema(baseSchema, moldPassportDynamicFieldConfig)

export type MoldPassportFormFields = z.infer<typeof moldPassportSchema>
