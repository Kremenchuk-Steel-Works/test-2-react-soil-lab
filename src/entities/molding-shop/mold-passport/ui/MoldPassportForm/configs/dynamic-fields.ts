import { z } from 'zod'
import {
  PassportDataAscSpecificFields,
  PassportDataGscSpecificFields,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/components/CastingTechnologySpecificFields'
import {
  AirSetCastingSpecificFields,
  GreenSandCastingSpecificFields,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/components/MoldingAreaIdSpecificFields'
import { createFormConfig } from '@/shared/lib/zod/dynamic-schema'
import type { Option } from '@/shared/ui/select/ReactSelect'

export interface MoldPassportDynamicFieldOptions {
  organizationsOptions: Option<string>[]
  positionsOptions: Option<string>[]
  addressOptions: Option<string>[]
  genderOptions: Option<string>[]
}

export const greenSandSchema = z.object({
  moldingSandType: z.string().optional(),
  moldingSandSubType: z.string().nonempty(),
  moldingSandNumber: z.string().optional(),
  moldHorizontalDensity: z.string().optional(),
  moldVerticalDensity: z.string().optional(),
})

export const airSetCastingSchema = z.object({
  moldingSandType: z.string().optional(),
  moldHardness: z.string().nonempty(),
  resinId: z.string().optional(),
})

export const moldPassportDynamicFieldConfig = createFormConfig<MoldPassportDynamicFieldOptions>([
  // Для участков Green Sand Casting Песчано-Глинистая
  {
    conditions: {
      moldingAreaId: ['male', 'female'],
    },
    schema: z.object({
      castingTechnologyId: z.string().optional(),
    }),
    Component: GreenSandCastingSpecificFields,
  },
  // Для участков Air Set Casting Холодно-Твердеющая
  {
    conditions: {
      moldingAreaId: 'other',
    },
    schema: z.object({
      castingTechnologyId: z.string().optional(),
    }),
    Component: AirSetCastingSpecificFields,
  },

  // Для технологии Green Sand Casting Песчано-Глинистая
  {
    conditions: {
      castingTechnologyId: ['male', 'female', 'other'],
    },
    schema: greenSandSchema,
    Component: PassportDataGscSpecificFields,
  },
  // Для технологии Air Set Casting Холодно-Твердеющая
  {
    conditions: {
      castingTechnologyId: ['billing', 'shipping', 'warehouse', 'plant', 'office', 'home'],
    },
    schema: airSetCastingSchema,
    Component: PassportDataAscSpecificFields,
  },
])
