import { z } from 'zod'
import { addressOptions } from '@/entities/admin/address/types/address'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const addressSchema = z.object({
  id: z.string().optional(),
  fullAddress: z.string().nonempty(),
  postalCode: z.string().optional(),
  type: z.enum(toZodEnumValues(addressOptions)),
  isPrimary: z.boolean(),
  note: z.string().optional(),
  cityId: z.number(),
})

export type AddressFormFields = z.infer<typeof addressSchema>
