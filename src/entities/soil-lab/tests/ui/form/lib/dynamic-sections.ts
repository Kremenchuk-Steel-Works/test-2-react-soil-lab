import z from 'zod'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { SamplesMoldingSandRecipe } from '@/entities/soil-lab/samples/model/moldingSandRecipe'
import { testsFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import {
  GasEvolutionDynamicForm,
  GasPermabilityDynamicForm,
  MoisturePercentDynamicForm,
  StrengthDynamicForm,
  TensileStrength0hDynamicForm,
  TensileStrength1hDynamicForm,
  TensileStrength3hDynamicForm,
  TensileStrength24hDynamicForm,
  TensileStrengthDynamicForm,
} from '@/entities/soil-lab/tests/ui/form/components/Measurement1DynamicForm'
import { TestType } from '@/shared/api/soil-lab/model'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandRecipe } = samplesFieldRegistry
const { measurement1, type } = testsFieldRegistry

export const measurement1FormSchema = z.object({
  [measurement1.key]: zn(z.number()),
})

export type Measurement1FormFields = z.infer<typeof measurement1FormSchema>

export const testsDynamicSections = createScopedSectionsConfig({
  [measurement1.key]: [
    // -- Формувальні суміші --
    // Суміш 13
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === SamplesMoldingSandRecipe[13] },
      children: [
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.strength },
          Component: StrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.N_PER_CM2,
              to: Units.KGF_PER_CM2,
              round: 2,
              min: 0.1,
              max: 5,
            }),
          }),
        },
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
              min: 50,
              max: 250,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number().min(0.1).max(5)),
          }),
        },
      ],
    },
    // Суміш 14
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === SamplesMoldingSandRecipe[14] },
      children: [
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.strength },
          Component: StrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.N_PER_CM2,
              to: Units.KGF_PER_CM2,
              round: 2,
              min: 0.1,
              max: 5,
            }),
          }),
        },
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
              min: 50,
              max: 250,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number().min(0.1).max(5)),
          }),
        },
      ],
    },
    // Суміш 15
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === SamplesMoldingSandRecipe[15] },
      children: [
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.strength },
          Component: StrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withUnitConversion(zn(z.number()), {
              from: Units.N_PER_CM2,
              to: Units.KGF_PER_CM2,
              round: 2,
              min: 0.1,
              max: 5,
            }),
          }),
        },
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
              min: 50,
              max: 250,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number().min(0.1).max(5)),
          }),
        },
      ],
    },
    // -- Стрижневі суміші --
    // Суміш 8
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === SamplesMoldingSandRecipe[8] },
      children: [
        // Міцність на розрив
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength },
          Component: TensileStrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
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
              min: 50,
              max: 250,
            }),
          }),
        },
        // Вологість
        {
          conditions: { [type.key]: (v) => v === TestType.moisture_percent },
          Component: MoisturePercentDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number().min(0.1).max(5)),
          }),
        },
      ],
    },
    // Суміш 1s
    {
      conditions: {
        [moldingSandRecipe.key]: [
          SamplesMoldingSandRecipe['1s'],
          SamplesMoldingSandRecipe['1hs'],
          SamplesMoldingSandRecipe['1s1s'],
          SamplesMoldingSandRecipe['1s2s'],
        ],
      },
      children: [
        // Міцність на розрив зразу
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_0h },
          Component: TensileStrength0hDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність на розрив через 1 год
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_1h },
          Component: TensileStrength1hDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність на розрив через 3 год
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_3h },
          Component: TensileStrength3hDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність на розрив через 24 год
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_24h },
          Component: TensileStrength24hDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Газоутворююча властивість
        {
          conditions: { [type.key]: (v) => v === TestType.gas_evolution },
          Component: GasEvolutionDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
      ],
    },
  ],
})
