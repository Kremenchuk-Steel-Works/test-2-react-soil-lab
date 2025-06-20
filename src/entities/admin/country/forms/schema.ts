import { z } from 'zod'

export const countrySchema = z.object({
  code: z.string().length(2).nonempty(),
  code3: z.string().length(3).optional(),
  numericCode: z.string().length(3).optional(),
  name: z.string().nonempty(),
  nameLocal: z.string().nonempty(),
})

export type CountryFormFields = z.infer<typeof countrySchema>
