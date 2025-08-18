import { z } from 'zod'
import {
  CastingTechnologyDataGscDynamicForm,
  CastingTechnologyPassportDataAscDynamicForm,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/components/CastingTechnologySpecificFields'
import { MoldingAreaDataDynamicForm } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/components/MoldingAreaIdSpecificFields'
import { MoldingSandSystem } from '@/shared/api/mold-passport/model'
import { ANY_VALUE, createFormConfig } from '@/shared/lib/zod/dynamic-schemaOld'

export const dataGscFormSchema = z.object({
  id: z.string().nullable().optional(),
  moldingSandSystem: z.nativeEnum(MoldingSandSystem),
  moldingSandNumber: z.string().nonempty(),
  moldHorizontalDensity: z.number().positive(),
  moldVerticalDensity: z.number().positive(),
})

export type MoldPassportDataGsc = z.infer<typeof dataGscFormSchema>

export const dataAscFormSchema = z.object({
  id: z.string().nullable().optional(),
  moldHardness: z.number().positive(),
  resinId: z.string().nullable().optional(),
})

export type MoldPassportDataAsc = z.infer<typeof dataAscFormSchema>

export const moldPassportDynamicFieldConfig = createFormConfig([
  // Для участков
  {
    conditions: {
      moldingAreaId: ANY_VALUE,
    },
    schema: z.object({
      castingTechnologyId: z.number(),
    }),
    Component: MoldingAreaDataDynamicForm,
  },

  // Для технологии Green Sand Casting Песчано-Глинистая
  {
    conditions: {
      castingTechnologyId: 1,
    },
    schema: z.object({ dataGsc: dataGscFormSchema.nullable().optional() }),
    Component: CastingTechnologyDataGscDynamicForm,
  },
  // Для технологии Air Set Casting Холодно-Твердеющая
  {
    conditions: {
      castingTechnologyId: 2,
    },
    schema: z.object({ dataAsc: dataAscFormSchema.nullable().optional() }),
    Component: CastingTechnologyPassportDataAscDynamicForm,
  },
])
