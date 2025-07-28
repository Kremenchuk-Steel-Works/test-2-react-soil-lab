import { z } from 'zod'
import { addressSchema } from '@/entities/admin/address/forms/schema'
import { contactSchema } from '@/entities/admin/contact/forms/schema'
import { employeeProfileSchema } from '@/entities/admin/employeeProfile/forms/schema'
import { genderOptions } from '@/entities/admin/people/types/gender'
import { moldPassportDynamicFieldConfig } from '@/entities/mold-passport/mold-passport/forms/configs/dynamic-fields'
import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

const baseSchema = z.object({
  firstName: z.string().nonempty(),

  // Dynamic fields
  identifier: z.string().optional(),
  letterCount: z.number().optional(),

  lastName: z.string().nonempty(),
  middleName: z.string().optional(),
  gender: z.enum(toZodEnumValues(genderOptions)),
  test: z.array(z.string()).optional(),

  // Dynamic fields
  militaryId: z.string().optional(),
  maidenName: z.string().optional(),

  birthDate: z.string().optional(),
  photoUrl: z.instanceof(File).optional(),
  employeeProfile: employeeProfileSchema.optional(),
  contacts: z.array(contactSchema),
  addresses: z.array(addressSchema),
  organizationIds: z.array(z.string()).optional(),
  positionIds: z.array(z.string()).optional(),
})

export const moldPassportSchema = createDynamicSchema(baseSchema, moldPassportDynamicFieldConfig)

export type MoldPassportFormFields = z.infer<typeof moldPassportSchema>
