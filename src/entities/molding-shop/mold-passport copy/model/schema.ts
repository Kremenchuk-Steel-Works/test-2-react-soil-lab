// import { z } from 'zod'
// import { moldCavityFormSchema } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
// import { moldPassportDynamicFieldConfig } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
// import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'

// const baseSchema = z.object({
//   moldingAreaId: z.string().optional(),

//   // Dynamic fields (trigger)
//   castingTechnologyId: z.string().optional(),

//   patternPlateFrameId: z.string().optional(),
//   moldingFlaskId: z.string().optional(),

//   markingYear: z.number().optional(),

//   moldCavities: z.array(moldCavityFormSchema).default([]),

//   pressingPressure: z.number().optional(),
//   moldSequenceInShift: z.number().optional(),
//   moldAssemblyTimestamp: z.string().optional(),
//   experimentIds: z.array(z.string()).optional(),
//   status: z.boolean().default(true),
//   notes: z.string().optional(),
// })

// export const moldPassportFormSchema = createDynamicSchema(
//   baseSchema,
//   moldPassportDynamicFieldConfig,
// )
// export type MoldPassportFormFields = z.infer<typeof moldPassportFormSchema>
// export const moldPassportFormDefaultValues: MoldPassportFormFields = moldPassportFormSchema.parse(
//   {},
// )
