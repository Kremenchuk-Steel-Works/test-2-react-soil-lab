import { z } from "zod"
import { employeeProfileSchema } from "../../employeeProfile/forms/schema"
import { contactSchema } from "../../contact/forms/schema"
import { addressSchema } from "../../address/forms/schema"
import { toZodEnumValues } from "../../../../utils/zodHelpers"
import { genderOptions } from "../types/gender"

export const peopleSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  middleName: z.string().optional(),
  gender: z.enum(toZodEnumValues(genderOptions)),
  birthDate: z.string().optional(),
  photoUrl: z.string().url().optional(),
  contacts: z.array(contactSchema),
  addresses: z.array(addressSchema),
  employeeProfile: employeeProfileSchema.optional(),
  organizationIds: z.array(z.string()),
  positionIds: z.array(z.string()),
})

export type PeopleFormFields = z.infer<typeof peopleSchema>
