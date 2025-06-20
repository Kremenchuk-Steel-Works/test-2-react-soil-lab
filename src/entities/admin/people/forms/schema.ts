import { z } from "zod"
import { employeeProfileSchema } from '@/entities/admin/employeeProfile/forms/schema'
import { contactSchema } from '@/entities/admin/contact/forms/schema'
import { addressSchema } from '@/entities/admin/address/forms/schema'
import { genderOptions } from '@/entities/admin/people/types/gender'
import { toZodEnumValues } from '@/shared/lib/zod'

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
  organizationIds: z.array(z.string()).nonempty(),
  positionIds: z.array(z.string()).nonempty(),
})

export type PeopleFormFields = z.infer<typeof peopleSchema>
