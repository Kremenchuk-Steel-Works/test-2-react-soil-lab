import { z } from "zod"
import optionalObject from "../../../utils/zodHelpers"

export const peopleEmployeeProfileSchema = z.object({
  employeeNumber: z
    .string()
    .nonempty()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Тільки цифри",
    }),
  hiredAt: z.string().nonempty(),
  employmentStatus: z.enum([
    "employed",
    "on_leave",
    "on_maternity",
    "terminated",
    "probation",
    "inactive",
  ]),
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
  gender: z.enum(["male", "female", "other"]),
  birthDate: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?\d+$/.test(val), {
      message: "Номер має містити лише цифри та, можливо, + на початку",
    }),
  employeeProfiles: optionalObject(peopleEmployeeProfileSchema),
  organizations: optionalObject(peopleOrganizationsSchema),
  positions: optionalObject(peoplePositionsSchema),
})

export type PeopleFormFields = z.infer<typeof peopleSchema>
