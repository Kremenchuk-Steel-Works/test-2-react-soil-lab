import { z } from 'zod'

export const moldingSandTypeFormSchema = z.object({
  name: z.string().optional(),
  abbreviation: z.string().optional(),
  castingTechnologyId: z.string().optional(),
})

export type MoldingSandTypeFormFields = z.infer<typeof moldingSandTypeFormSchema>
