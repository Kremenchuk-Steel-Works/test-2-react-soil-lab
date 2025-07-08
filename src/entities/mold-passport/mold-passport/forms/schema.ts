import { z } from 'zod'
import { addressSchema } from '@/entities/admin/address/forms/schema'
import { contactSchema } from '@/entities/admin/contact/forms/schema'
import { employeeProfileSchema } from '@/entities/admin/employeeProfile/forms/schema'
import { genderOptions } from '@/entities/admin/people/types/gender'
import { toZodEnumValues } from '@/shared/lib/zod'

const baseMoldPassportSchema = z.object({
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

// Схема для специфичных полей "Чоловіча" стать
const maleSpecificSchema = z.object({
  militaryId: z.string().nonempty("Військовий квиток є обов'язковим"),
})

// Схема для специфичных полей "Жіноча" стать
const femaleSpecificSchema = z.object({
  maidenName: z.string().optional(),
  militaryId: z.string().optional(),
})

const allSpecificFields = maleSpecificSchema.merge(femaleSpecificSchema).partial()

export const moldPassportSchema = baseMoldPassportSchema
  .and(allSpecificFields)
  .superRefine((data, ctx) => {
    if (data.gender === 'male') {
      const result = maleSpecificSchema.safeParse(data)
      if (!result.success) {
        result.error.issues.forEach((issue) => ctx.addIssue(issue))
      }
    }

    if (data.gender === 'female') {
      const result = femaleSpecificSchema.safeParse(data)
      if (!result.success) {
        result.error.issues.forEach((issue) => ctx.addIssue(issue))
      }
    }
  })

export type MoldPassportFormFields = z.infer<typeof moldPassportSchema>
