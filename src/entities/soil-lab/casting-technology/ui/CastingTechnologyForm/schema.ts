import { z } from 'zod'

export const castingTechnologyFormSchema = z.object({
  name: z.string().optional(),
  abbreviation: z.string().optional(),
})

export type CastingTechnologyFormFields = z.infer<typeof castingTechnologyFormSchema>
