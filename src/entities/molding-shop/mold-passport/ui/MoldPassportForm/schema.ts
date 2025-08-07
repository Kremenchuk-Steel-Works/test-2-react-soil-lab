import type { DeepPartial } from 'react-hook-form'
import { z } from 'zod'
import { moldCavityFormSchema } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import {
  dataAscFormSchema,
  dataGscFormSchema,
  moldPassportDynamicFieldConfig,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'

const baseSchema = z.object({
  moldingAreaId: z.number(),

  // Dynamic fields (trigger)
  castingTechnologyId: z.number(),

  patternPlateFrameId: z.string().nullable().optional(),
  moldingFlaskId: z.string().nullable().optional(),

  // Dynamic fields
  dataGsc: dataGscFormSchema.nullable().optional(),
  dataAsc: dataAscFormSchema.nullable().optional(),

  markingYear: z.number().nullable().optional(),

  moldCavities: z.array(moldCavityFormSchema),

  pressingPressure: z.number().nullable().optional(),
  sequenceInShift: z.number().nullable().optional(),
  assemblyTimestamp: z.string().nullable(),
  isDefective: z.boolean().optional(),
  notes: z.string().nullable().optional(),
})

export const moldPassportFormSchema = createDynamicSchema(
  baseSchema,
  moldPassportDynamicFieldConfig,
)
export type MoldPassportFormFields = z.infer<typeof moldPassportFormSchema>
export const moldPassportFormDefaultValues: DeepPartial<MoldPassportFormFields> = {
  moldCavities: [],
}
