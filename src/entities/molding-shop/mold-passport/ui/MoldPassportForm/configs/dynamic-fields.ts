import { z } from 'zod'
import {
  CastingTechnologyDataGscDynamicForm,
  CastingTechnologyPassportDataAscDynamicForm,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/components/CastingTechnologySpecificFields'
import {
  MoldingAreaDataAscDynamicForm,
  MoldingAreaDataGscDynamicForm,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/components/MoldingAreaIdSpecificFields'
import { MoldingSandSystem } from '@/shared/api/mold-passport/model'
import { createFormConfig } from '@/shared/lib/zod/dynamic-schema'
import type { Option } from '@/shared/ui/select/ReactSelect'

export interface MoldPassportDynamicFieldOptions {
  resinsOptions: Option<number>[]
  castingTechnologiesOptions: Option<number>[]
  // positionsOptions: Option<string>[]
  // addressOptions: Option<string>[]
  // genderOptions: Option<string>[]
}

export const dataGscFormSchema = z.object({
  moldingSandSystem: z.nativeEnum(MoldingSandSystem),
  moldingSandNumber: z.string().nonempty(),
  moldHorizontalDensity: z.number().positive(),
  moldVerticalDensity: z.number().positive(),
})

export type MoldPassportDataGsc = z.infer<typeof dataGscFormSchema>

export const dataAscFormSchema = z.object({
  moldHardness: z.number().positive(),
  resinId: z.string().nullable().optional(),
})

export type MoldPassportDataAsc = z.infer<typeof dataAscFormSchema>

export const moldPassportDynamicFieldConfig = createFormConfig<MoldPassportDynamicFieldOptions>([
  // Для участков Green Sand Casting Песчано-Глинистая
  {
    conditions: {
      moldingAreaId: ['male', 'female'],
    },
    schema: z.object({
      castingTechnologyId: z.number(),
    }),
    Component: MoldingAreaDataGscDynamicForm,
  },
  // Для участков Air Set Casting Холодно-Твердеющая
  {
    conditions: {
      moldingAreaId: 'other',
    },
    schema: z.object({
      castingTechnologyId: z.number(),
    }),
    Component: MoldingAreaDataAscDynamicForm,
  },

  // Для технологии Green Sand Casting Песчано-Глинистая
  {
    conditions: {
      castingTechnologyId: ['male', 'female', 'other'],
    },
    schema: z.object({ dataGsc: dataGscFormSchema.nullable().optional() }),
    Component: CastingTechnologyDataGscDynamicForm,
  },
  // Для технологии Air Set Casting Холодно-Твердеющая
  {
    conditions: {
      castingTechnologyId: ['billing', 'shipping', 'warehouse', 'plant', 'office', 'home'],
    },
    schema: z.object({ dataAsc: dataAscFormSchema.nullable().optional() }),
    Component: CastingTechnologyPassportDataAscDynamicForm,
  },
])
