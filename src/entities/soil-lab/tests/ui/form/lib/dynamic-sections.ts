import z from 'zod'
import { MIXTURES } from '@/entities/soil-lab/samples/model/mixtures'
import { testsFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { GasPermabilityDynamicForm } from '@/entities/soil-lab/tests/ui/form/components/GasPermabilityDynamicForm'
import { MoisturePercentDynamicForm } from '@/entities/soil-lab/tests/ui/form/components/MoisturePercentDynamicForm'
import { StrengthDynamicForm } from '@/entities/soil-lab/tests/ui/form/components/StrengthDynamicForm'
import { TestType } from '@/shared/api/soil-lab-2/model'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { measurement1, type, moldingSandRecipe } = testsFieldRegistry

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
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.SI_E8,
              to: Units.PN,
              instrument: Instruments.LPIR1,
              round: 0,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.strength },
          Component: StrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.N_PER_CM2,
              to: Units.KGF_PER_CM2,
              round: 2,
            }),
          }),
        },
      ],
    },
    // Суміш 14
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === MIXTURES['14'] },
      children: [
        // Газопроникність
        {
          conditions: { [type.key]: (v) => v === TestType.gas_permeability },
          Component: GasPermabilityDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.SI_E8,
              to: Units.PN,
              instrument: Instruments.LPIR1,
              round: 0,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.strength },
          Component: StrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.N_PER_CM2,
              to: Units.KGF_PER_CM2,
              round: 2,
            }),
          }),
        },
      ],
    },
    // Суміш 15
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === MIXTURES['15'] },
      children: [
        // Газопроникність
        {
          conditions: { [type.key]: (v) => v === TestType.gas_permeability },
          Component: GasPermabilityDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.SI_E8,
              to: Units.PN,
              instrument: Instruments.LPIR1,
              round: 0,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.strength },
          Component: StrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.N_PER_CM2,
              to: Units.KGF_PER_CM2,
              round: 2,
            }),
          }),
        },
      ],
    },
  ],
})
