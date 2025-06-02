import { z } from "zod"
import { toZodEnumValues } from "../../../../utils/zodHelpers"
import { addressOptions } from "../types/address"

export const addressSchema = z.object({
  street: z.string().nonempty(),
  cityId: z.number(),
  countryId: z.number(),
  postalCode: z.string().optional(),
  isPrimary: z.boolean(),
  type: z.enum(toZodEnumValues(addressOptions)),
  note: z.string().optional(),
})

export type AddressFormFields = z.infer<typeof addressSchema>
