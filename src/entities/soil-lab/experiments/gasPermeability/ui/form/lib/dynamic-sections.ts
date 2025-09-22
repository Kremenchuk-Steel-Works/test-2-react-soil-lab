import z from 'zod'
import { gasPermeabilityFieldRegistry } from '@/entities/soil-lab/experiments/gasPermeability/model/fields-registry'
import { GasPermabilityDynamicForm } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/components/GasPermabilityDynamicForm'
import { MACHINE_TYPES } from '@/entities/soil-lab/experiments/model/machineTypes'
import { MIXTURES } from '@/entities/soil-lab/experiments/model/mixtures'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { PermeabilityUnits } from '@/shared/lib/zod/unit-conversion/units/permeability'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType, gasPermeability } = gasPermeabilityFieldRegistry

export const gasPermeabilityFormSchema = z.object({
  [gasPermeability.key]: zn(z.number()),
})

export type GasPermeabilityFormFields = z.infer<typeof gasPermeabilityFormSchema>

export const experimentsGasPermeabilityDynamicSections = createScopedSectionsConfig({
  [gasPermeability.key]: [
    // Суміш 13
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['13'] },
      Component: GasPermabilityDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: PermeabilityUnits.SI_E8,
              to: PermeabilityUnits.PN,
              min: 100,
              max: 1,
              round: 2,
            }),
          }),
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: PermeabilityUnits.SI_E8,
              to: PermeabilityUnits.PN,
              min: 100,
              round: 2,
            }),
          }),
        },
      ],
    },

    // Суміш 14
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['14'] },
      Component: GasPermabilityDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: PermeabilityUnits.SI_E8,
              to: PermeabilityUnits.PN,
              min: 100,
              round: 2,
            }),
          }),
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: PermeabilityUnits.SI_E8,
              to: PermeabilityUnits.PN,
              min: 100,
              round: 2,
            }),
          }),
        },
      ],
    },

    // Суміш 15
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['15'] },
      Component: GasPermabilityDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: PermeabilityUnits.SI_E8,
              to: PermeabilityUnits.PN,
              min: 100,
              round: 2,
            }),
          }),
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: PermeabilityUnits.SI_E8,
              to: PermeabilityUnits.PN,
              min: 100,
              round: 2,
            }),
          }),
        },
      ],
    },
  ],
})
