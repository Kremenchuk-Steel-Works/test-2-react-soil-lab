import { z } from 'zod'

export const ironOxideFormSchema = z.object({
  brand: z.string().optional(),
  name: z.string().optional(),
})

export type IronOxideFormFields = z.infer<typeof ironOxideFormSchema>
