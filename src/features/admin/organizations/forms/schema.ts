import { z } from "zod"
import { contactSchema } from "../../contact/forms/schema"
import { addressSchema } from "../../address/forms/schema"

export const organizationsSchema = z.object({
  legalName: z.string().nonempty(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  countryId: z.number(),
  contacts: z.array(contactSchema),
  addresses: z.array(addressSchema),
})

export type OrganizationsFormFields = z.infer<typeof organizationsSchema>
