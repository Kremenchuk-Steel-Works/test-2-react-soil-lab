import z from 'zod'
import { MIXTURES } from '@/entities/soil-lab/experiments/model/mixtures'
import { strengthFieldRegistry } from '@/entities/soil-lab/experiments/strength/model/fields-registry'
import { CompressiveStrengthDynamicForm } from '@/entities/soil-lab/experiments/strength/ui/form/components/CompressiveStrengthDynamicForm'
import { createSectionsConfig } from '@/shared/lib/zod/dynamic-schema'
import { PressureUnits } from '@/shared/lib/zod/pressure-conversion/pressure'
import { withUnitConversion } from '@/shared/lib/zod/pressure-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, compressiveStrength } = strengthFieldRegistry

export const compressiveStrengthFormSchema = z.object({
  [compressiveStrength.key]: zn(z.number()),
})

export type StrengthContentPercentFormFields = z.infer<typeof compressiveStrengthFormSchema>

export const experimentsStrengthDynamicSections = createSectionsConfig({
  // Секции
  [compressiveStrength.key]: [
    // Смесь 13
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['13'],
      },
      schema: z.object({
        [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
          from: PressureUnits.N_PER_CM2,
          to: PressureUnits.KGF_PER_CM2,
          min: 1.05,
          max: 1.2,
          round: 2,
        }),
      }),
      Component: CompressiveStrengthDynamicForm,
    },
    // Смесь 14
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['14'],
      },
      schema: z.object({
        [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
          from: PressureUnits.N_PER_CM2,
          to: PressureUnits.KGF_PER_CM2,
          min: 1.2,
          max: 1.3,
          round: 2,
        }),
      }),
      Component: CompressiveStrengthDynamicForm,
    },
    // Смесь 15
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['15'],
      },
      schema: z.object({
        [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
          from: PressureUnits.N_PER_CM2,
          to: PressureUnits.KGF_PER_CM2,
          min: 1.05,
          max: 1.2,
          round: 2,
        }),
      }),
      Component: CompressiveStrengthDynamicForm,
    },
  ],
})
