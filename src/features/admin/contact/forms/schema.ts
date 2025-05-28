import { z } from "zod"
import { contactTypes } from "../types/contact"

export const contactSchema = z.object({
  isPrimary: z.boolean(),
  type: z.enum(contactTypes),
  value: z.string().nonempty(),
  note: z.string().optional(),
})

export type ContactFormFields = z.infer<typeof contactSchema>
