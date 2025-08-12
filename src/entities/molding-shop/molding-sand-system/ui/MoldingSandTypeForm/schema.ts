import { z } from 'zod'

export const moldingSandSystemFormSchema = z.object({
  name: z.string().optional(),
  abbreviation: z.string().optional(),
  castingTechnologyId: z.string().optional(),
})

export type MoldingSandSystemFormFields = z.infer<typeof moldingSandSystemFormSchema>
