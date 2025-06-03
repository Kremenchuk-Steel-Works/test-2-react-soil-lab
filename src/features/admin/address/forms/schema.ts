import { z } from "zod"
import { toZodEnumValues } from "../../../../utils/zodHelpers"
import { addressOptions } from "../types/address"

export const addressSchema = z.object({
  street: z.string().nonempty(),
  postalCode: z.string().optional(),
  type: z.enum(toZodEnumValues(addressOptions)),
  isPrimary: z.boolean(),
  note: z.string().optional(),
  cityId: z.number(),
})

export type AddressFormFields = z.infer<typeof addressSchema>
