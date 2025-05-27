import { z } from "zod"
import optionalObject from "../../../../utils/zodHelpers"
import { contactTypes } from "../../contact/types/contact"
import { addressTypes } from "../../address/types/address"
import { employmentStatuses } from "../../employeeProfile/types/employmentStatus"
import { genderTypes } from "../types/gender"

export const contactSchema = z.object({
  isPrimary: z.boolean(),
  type: z.enum(contactTypes),
  value: z.string().nonempty(),
  note: z.string().nullable(),
})

export const addressSchema = z.object({
  street: z.string().nonempty(),
  cityName: z.string().nonempty(),
  countryName: z.string().nonempty(),
  postalCode: z.string().nullable(),
  isPrimary: z.boolean(),
  type: z.enum(addressTypes),
  note: z.string().nullable(),
})

export const peopleEmployeeProfileSchema = z.object({
  employeeNumber: z
    .string()
    .nonempty()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Тільки цифри",
    }),
  hiredAt: z.string().nonempty(),
  employmentStatus: z.enum(employmentStatuses),
})

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
  contacts: contactSchema,
  addresses: addressSchema,
  employeeProfiles: optionalObject(peopleEmployeeProfileSchema),
  organizations: optionalObject(peopleOrganizationsSchema),
  positions: optionalObject(peoplePositionsSchema),
})

export type PeopleFormFields = z.infer<typeof peopleSchema>
