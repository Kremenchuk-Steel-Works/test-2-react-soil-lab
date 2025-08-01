import { z } from 'zod'

export const triethylamineFormSchema = z.object({
  brand: z.string().optional(),
  name: z.string().optional(),
})

export type TriethylamineFormFields = z.infer<typeof triethylamineFormSchema>
