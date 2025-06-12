import { z } from "zod"
import { contactOptions } from "../types/contact"
import { toZodEnumValues } from "../../../../lib/zod"

export const contactSchema = z.object({
  type: z.enum(toZodEnumValues(contactOptions)),
  value: z.string().nonempty(),
  isPrimary: z.boolean(),
  note: z.string().optional(),
})

export type ContactFormFields = z.infer<typeof contactSchema>
