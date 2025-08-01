import { z } from 'zod'

export const countrySchema = z.object({
  isoAlpha2: z.string().length(2).nonempty(),
  isoAlpha3: z.string().length(3).nonempty(),
  isoNumeric: z.string().length(3).nonempty(),
  name: z.string().nonempty(),
})

export type CountryFormFields = z.infer<typeof countrySchema>
