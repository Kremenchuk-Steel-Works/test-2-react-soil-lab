import z from 'zod'
import { MACHINE_TYPES } from '@/entities/soil-lab/experiments/model/machineTypes'
import { MIXTURES } from '@/entities/soil-lab/experiments/model/mixtures'
import { strengthFieldRegistry } from '@/entities/soil-lab/experiments/strength/model/fields-registry'
import { CompressiveStrengthDynamicForm } from '@/entities/soil-lab/experiments/strength/ui/form/components/CompressiveStrengthDynamicForm'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { PressureUnits } from '@/shared/lib/zod/pressure-conversion/pressure'
import { withUnitConversion } from '@/shared/lib/zod/pressure-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType, compressiveStrength } = strengthFieldRegistry

export const compressiveStrengthFormSchema = z.object({
  [compressiveStrength.key]: zn(z.number()),
})

export type StrengthContentPercentFormFields = z.infer<typeof compressiveStrengthFormSchema>

export const experimentsStrengthDynamicSections = createScopedSectionsConfig({
  [compressiveStrength.key]: [
    // Суміш 13
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['13'] },
      Component: CompressiveStrengthDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          schema: z.object({
            [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
              from: PressureUnits.N_PER_CM2,
              to: PressureUnits.KGF_PER_CM2,
              min: 1.05,
              max: 1.2,
              round: 2,
            }),
          }),
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
              from: PressureUnits.N_PER_CM2,
              to: PressureUnits.KGF_PER_CM2,
              min: 1.1,
              max: 1.25,
              round: 2,
            }),
          }),
        },
      ],
    },

    // Суміш 14
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['14'] },
      Component: CompressiveStrengthDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          schema: z.object({
            [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
              from: PressureUnits.N_PER_CM2,
              to: PressureUnits.KGF_PER_CM2,
              min: 1.2,
              max: 1.3,
              round: 2,
            }),
          }),
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
              from: PressureUnits.N_PER_CM2,
              to: PressureUnits.KGF_PER_CM2,
              min: 1.25,
              max: 1.4,
              round: 2,
            }),
          }),
        },
      ],
    },

    // Суміш 15
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['15'] },
      Component: CompressiveStrengthDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          schema: z.object({
            [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
              from: PressureUnits.N_PER_CM2,
              to: PressureUnits.KGF_PER_CM2,
              min: 1.05,
              max: 1.2,
              round: 2,
            }),
          }),
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [compressiveStrength.key]: withUnitConversion(zn(z.number()), {
              from: PressureUnits.N_PER_CM2,
              to: PressureUnits.KGF_PER_CM2,
              min: 1.1,
              max: 1.25,
              round: 2,
            }),
          }),
        },
      ],
    },
  ],
})
