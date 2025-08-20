import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { moldCavityFormSchema } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import {
  dataAscFormSchema,
  dataGscFormSchema,
  moldPassportDynamicSections,
} from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const baseSchema = z.object({
  moldingAreaId: zn(z.number()),

  // Dynamic fields (trigger)
  castingTechnologyId: zn(z.number()),

  patternPlateFrameId: zn(z.string().nullable().optional()),
  moldingFlaskId: zn(z.string().nullable().optional()),

  // Dynamic fields
  dataGsc: dataGscFormSchema.nullable().optional(),
  dataAsc: dataAscFormSchema.nullable().optional(),

  moldCavities: z.array(moldCavityFormSchema).min(1),

  pressingPressure: zn(z.number().nullable().optional()),
  sequenceInShift: zn(z.number().nullable().optional()),
  assemblyTimestamp: zn(z.string().nullable().optional()),
  isDefective: z.boolean().optional(),
  notes: zn(z.string().nullable().optional()),
})

export const moldPassportFormSchema = createDynamicSchema(baseSchema, moldPassportDynamicSections)
export type MoldPassportFormFields = z.infer<typeof moldPassportFormSchema>
export const moldPassportFormDefaultValues: DeepPartial<MoldPassportFormFields> = {
  moldCavities: [],
}
