import { z } from 'zod'
import { contactOptions } from '@/entities/admin/contact/types/contact'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const contactSchema = z.object({
  id: z.string().optional(),
  type: z.enum(toZodEnumValues(contactOptions)),
  value: z.string().nonempty(),
  isPrimary: z.boolean(),
  note: z.string().optional(),
})

export type ContactFormFields = z.infer<typeof contactSchema>
