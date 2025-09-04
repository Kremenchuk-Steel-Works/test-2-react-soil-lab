import { z } from 'zod'
import { CastingTechnologyId } from '@/entities/molding-shop-update/mold-passport/model/castingTechnologyId'
import {
  CastingTechnologyDataGscDynamicForm,
  CastingTechnologyPassportDataAscDynamicForm,
} from '@/entities/molding-shop-update/mold-passport/ui/form/components/CastingTechnologyDynamicFields'
import { MoldingAreaDataDynamicForm } from '@/entities/molding-shop-update/mold-passport/ui/form/components/MoldingAreaIdDynamicFields'
import { MoldingSandSystem } from '@/shared/api/mold-passport/model'
import {
  ANY_VALUE,
  createSectionsConfig,
  type DynamicSectionsConfig,
} from '@/shared/lib/zod/dynamic-schema'

export const castingTechnology = z.object({
  castingTechnologyId: z.number(),
})

export type CastingTechnology = z.infer<typeof castingTechnology>

export const dataGscFormSchema = z.object({
  id: z.string().nullable().optional(),
  moldingSandSystem: z.nativeEnum(MoldingSandSystem),
  moldingSandNumber: z.string().nonempty(),
  moldHorizontalDensity: z.number().positive(),
  moldVerticalDensity: z.number().positive(),
})

export const withDataGscFormSchema = z.object({ dataGsc: dataGscFormSchema.nullable().optional() })

export type MoldPassportDataGsc = z.infer<typeof dataGscFormSchema>
export type WithDataGscFormFields = z.infer<typeof withDataGscFormSchema>

export const dataAscFormSchema = z.object({
  id: z.string().nullable().optional(),
  moldHardness: z.number().positive(),
  resinId: z.string().nullable().optional(),
})

export const withDataAscFormSchema = z.object({ dataAsc: dataAscFormSchema.nullable().optional() })

export type MoldPassportDataAsc = z.infer<typeof dataAscFormSchema>
export type WithDataAscFormFields = z.infer<typeof withDataAscFormSchema>

export const moldPassportDynamicSections = createSectionsConfig({
  // Для участков
  moldingAreaId: [
    {
      id: 'moldingAreaId',
      conditions: {
        moldingAreaId: ANY_VALUE,
      },
      schema: castingTechnology,
      Component: MoldingAreaDataDynamicForm,
    },
  ],

  // Для технологии Green Sand Casting Песчано-Глинистая
  castingTechnologyId: [
    {
      id: 'dataGsc',
      conditions: {
        castingTechnologyId: CastingTechnologyId.GSC,
      },
      schema: withDataGscFormSchema,
      Component: CastingTechnologyDataGscDynamicForm,
    },
    // Для технологии Air Set Casting Холодно-Твердеющая
    {
      id: 'dataAsc',
      conditions: {
        castingTechnologyId: CastingTechnologyId.ASC,
      },
      schema: z.object({ dataAsc: dataAscFormSchema.nullable().optional() }),
      Component: CastingTechnologyPassportDataAscDynamicForm,
    },
  ],
} as const satisfies DynamicSectionsConfig)
