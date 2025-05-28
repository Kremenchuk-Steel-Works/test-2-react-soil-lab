import { z } from "zod"
import optionalObject from "../../../../utils/zodHelpers"
import { genderTypes } from "../types/gender"
import { employeeProfileSchema } from "../../employeeProfile/forms/schema"
import { contactSchema } from "../../contact/forms/schema"
import { addressSchema } from "../../address/forms/schema"

export const peopleOrganizationsSchema = z.object({
  organizationId: z.string().nonempty(),
})

export const peoplePositionsSchema = z.object({
  positionId: z.string().nonempty(),
})

export const peopleSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  middleName: z.string().optional(),
  gender: z.enum(genderTypes),
  birthDate: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  contacts: z.array(contactSchema),
  addresses: z.array(addressSchema),
  employeeProfile: optionalObject(employeeProfileSchema),
  organizations: z.array(optionalObject(peopleOrganizationsSchema)),
  positions: z.array(optionalObject(peoplePositionsSchema)),
})

export type PeopleFormFields = z.infer<typeof peopleSchema>
