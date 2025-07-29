import { z } from 'zod'
import { moldCavitySchema } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import { moldPassportDynamicFieldConfig } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'

const baseSchema = z.object({
  moldingAreaId: z.string().optional(),

  // Dynamic fields
  castingTechnologyId: z.string().optional(),

  patternPlateFrameId: z.string().optional(),
  moldingFlaskId: z.string().optional(),

  // Dynamic fields

  // Green Sand Casting Песчано-Глинистая
  moldingSandType: z.string().optional(),
  moldingSandSubType: z.string().optional(),
  moldingSandNumber: z.string().optional(),
  moldHorizontalDensity: z.string().optional(),
  moldVerticalDensity: z.string().optional(),

  // Air Set Casting Холодно-Твердеющая
  // moldingSandType: z.string().optional(),
  moldHardness: z.string().optional(),
  resinId: z.string().optional(),
  //

  markingYear: z.number().optional(),

  moldCavities: z.array(moldCavitySchema),

  // lastName: z.string().nonempty(),
  // middleName: z.string().optional(),
  // gender: z.enum(toZodEnumValues(genderOptions)),
  // test: z.array(z.string()).optional(),

  // // Dynamic fields
  // militaryId: z.string().optional(),
  // maidenName: z.string().optional(),

  // birthDate: z.string().optional(),
  // photoUrl: z.instanceof(File).optional(),
  // employeeProfile: employeeProfileSchema.optional(),
  // contacts: z.array(contactSchema),
  // addresses: z.array(addressSchema),
  // organizationIds: z.array(z.string()).optional(),
  // positionIds: z.array(z.string()).optional(),
})

export const moldPassportSchema = createDynamicSchema(baseSchema, moldPassportDynamicFieldConfig)

export type MoldPassportFormFields = z.infer<typeof moldPassportSchema>
