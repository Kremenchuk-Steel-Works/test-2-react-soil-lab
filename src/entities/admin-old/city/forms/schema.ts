import { z } from 'zod'

export const citySchema = z.object({
  name: z.string().nonempty(),
  nameLocal: z.string().nonempty(),
  countryId: z.number(),
})

export type CityFormFields = z.infer<typeof citySchema>
