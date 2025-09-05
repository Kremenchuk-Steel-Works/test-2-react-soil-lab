import { z } from 'zod'
import { addressSchema } from '@/entities/admin-old/address/forms/schema'
import { contactSchema } from '@/entities/admin-old/contact/forms/schema'
import { employeeProfileSchema } from '@/entities/admin-old/employeeProfile/forms/schema'
import { genderOptions } from '@/entities/admin-old/people/types/gender'
import { toZodEnumValues } from '@/shared/lib/zod/utils'

export const peopleSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  middleName: z.string().optional(),
  gender: z.enum(toZodEnumValues(genderOptions)),
  birthDate: z.string().optional(),
  photoUrl: z.instanceof(File).optional(),
  employeeProfile: employeeProfileSchema.optional(),
  contacts: z.array(contactSchema),
  addresses: z.array(addressSchema),
  organizationIds: z.array(z.string()).optional(),
  positionIds: z.array(z.string()).optional(),
})

export type PeopleFormFields = z.infer<typeof peopleSchema>
