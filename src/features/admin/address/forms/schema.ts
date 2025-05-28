import { z } from "zod"
import { addressTypes } from "../types/address"

export const addressSchema = z.object({
  street: z.string().nonempty(),
  cityName: z.string().nonempty(),
  countryName: z.string().nonempty(),
  postalCode: z.string().optional(),
  isPrimary: z.boolean(),
  type: z.enum(addressTypes),
  note: z.string().optional(),
})

export type AddressFormFields = z.infer<typeof addressSchema>
