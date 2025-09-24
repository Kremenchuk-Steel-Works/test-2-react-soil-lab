import z from 'zod'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { MIXTURES } from '@/entities/soil-lab/samples/model/mixtures'
import {
  testsFieldRegistry,
  testsTypeFieldRegistry,
} from '@/entities/soil-lab/tests/model/fields-registry'
import { GasPermabilityDynamicForm } from '@/entities/soil-lab/tests/ui/form/components/GasPermabilityDynamicForm'
import { TestType } from '@/shared/api/soil-lab-2/model'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { measurement1, type } = testsFieldRegistry
const { gasPermeability, moisturePercent, strength } = testsTypeFieldRegistry
const { moldingSandRecipe } = samplesFieldRegistry

export const measurement1FormSchema = z.object({
  [measurement1.key]: zn(z.number()),
})

export type Measurement1FormFields = z.infer<typeof measurement1FormSchema>

export const testsDynamicSections = createScopedSectionsConfig({
  [measurement1.key]: [
    // Суміш 13
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === MIXTURES['13'] },
      children: [
        // Газопроникність
        {
          conditions: { [type.key]: (v) => v === TestType.gas_permeability },
          Component: GasPermabilityDynamicForm,
          schema: z.object({
            [gasPermeability.key]: withUnitConversion(zn(z.number()), {
              from: Units.SI_E8,
              to: Units.PN,
              instrument: Instruments.LPIR1,
              min: 100,
              round: 0,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: ,
          schema: z.object({
            [gasPermeability.key]: zn(z.number().min(2.6).max(3.1)),
          }),
        },
      ],
    },
    // // Суміш 14
    // {
    //   conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['14'] },
    //   Component: GasPermabilityDynamicForm,
    //   children: [
    //     // Змішувач
    //     {
    //       conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
    //       schema: z.object({
    //         [gasPermeability.key]: withUnitConversion(zn(z.number()), {
    //           from: Units.SI_E8,
    //           to: Units.PN,
    //           instrument: Instruments.LPIR1,
    //           min: 100,
    //           round: 0,
    //         }),
    //       }),
    //     },
    //     // АФЛ
    //     {
    //       conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
    //       schema: z.object({
    //         [gasPermeability.key]: withUnitConversion(zn(z.number()), {
    //           from: Units.SI_E8,
    //           to: Units.PN,
    //           instrument: Instruments.LPIR1,
    //           min: 100,
    //           round: 0,
    //         }),
    //       }),
    //     },
    //   ],
    // },

    // // Суміш 15
    // {
    //   conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['15'] },
    //   Component: GasPermabilityDynamicForm,
    //   children: [
    //     // Змішувач
    //     {
    //       conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
    //       schema: z.object({
    //         [gasPermeability.key]: withUnitConversion(zn(z.number()), {
    //           from: Units.SI_E8,
    //           to: Units.PN,
    //           instrument: Instruments.LPIR1,
    //           min: 100,
    //           round: 0,
    //         }),
    //       }),
    //     },
    //     // АФЛ
    //     {
    //       conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
    //       schema: z.object({
    //         [gasPermeability.key]: withUnitConversion(zn(z.number()), {
    //           from: Units.SI_E8,
    //           to: Units.PN,
    //           instrument: Instruments.LPIR1,
    //           min: 100,
    //           round: 0,
    //         }),
    //       }),
    //     },
    //   ],
    // },
  ],
})
