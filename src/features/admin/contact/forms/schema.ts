import { z } from "zod"
import { toZodEnumValues } from "../../../../utils/zodHelpers"
import { contactOptions } from "../types/contact"

export const contactSchema = z.object({
  isPrimary: z.boolean(),
  type: z.enum(toZodEnumValues(contactOptions)),
  value: z.string().nonempty(),
  note: z.string().optional(),
})

export type ContactFormFields = z.infer<typeof contactSchema>
