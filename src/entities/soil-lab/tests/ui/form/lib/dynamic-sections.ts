import z from 'zod'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { SamplesMoldingSandRecipe } from '@/entities/soil-lab/samples/model/moldingSandRecipe'
import { testsFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import {
  CompressiveStrengthDynamicForm,
  GasFormingPropertyDynamicForm,
  GasPermabilityDynamicForm,
  MoisturePercentDynamicForm,
  TensileStrengthAfter0HoursDynamicForm,
  TensileStrengthAfter1HourDynamicForm,
  TensileStrengthAfter3HoursDynamicForm,
  TensileStrengthAfter24HoursDynamicForm,
  TensileStrengthDynamicForm,
} from '@/entities/soil-lab/tests/ui/form/components/Measurement1DynamicForm'
import { TestType } from '@/shared/api/soil-lab/model'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { Transforms } from '@/shared/lib/zod/unit-conversion/transforms'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-registry'
import { withFormulaTransform } from '@/shared/lib/zod/unit-conversion/withFormulaTransform'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { objectFromInputs } from '@/shared/lib/zod/utils'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandRecipe } = samplesFieldRegistry
const { measurement1, type } = testsFieldRegistry

export const measurement1FormSchema = z.object({
  [measurement1.key]: zn(z.number()),
})
export type Measurement1FormFields = z.infer<typeof measurement1FormSchema>

export const measurement1CompressiveStrengthFormSchema = z.object({
  [measurement1.key]: z.object({
    m1: zn(z.number()),
    m: zn(z.number().positive()),
  }),
})
export type Measurement1CompressiveStrengthFormFields = z.infer<
  typeof measurement1CompressiveStrengthFormSchema
>

export const testsDynamicSections = createScopedSectionsConfig({
  [measurement1.key]: [
    // -- Формувальні суміші --
    // Суміш 13
    {
      conditions: { [moldingSandRecipe.key]: (v) => v === SamplesMoldingSandRecipe[13] },
      children: [
        // Міцність
        {
          conditions: { [type.key]: (v) => v === TestType.compressive_strength },
          Component: CompressiveStrengthDynamicForm,
          schema: z.object({
            [measurement1.key]: withFormulaTransform(
              objectFromInputs(Transforms.AFS_GRAIN_FINENESS_NUMBER_TRANSFORM.inputs, (z) =>
                zn(z.number()),
              ),
              {
                transform: Transforms.AFS_GRAIN_FINENESS_NUMBER_TRANSFORM,
                round: 1,
                min: 0,
                max: 0,
              },
            ),
          }),

          // schema: z.object({
          //   [measurement1.key]: withFormulaTransform(
          //     z.object({
          //       m1: zn(z.number()), // маса залишку
          //       m: zn(z.number().positive()), // маса наважки
          //     }),
          //     {
          //       transform: Transforms.CLAY_COMPONENT_OF_SAND_TRANSFORM,
          //       round: 2,
          //       min: 0,
          //       max: 100,
          //     },
          //   ),
          // }),

          // schema: z.object({
          //   [measurement1.key]: withUnitConversion(zn(z.number()), {
          //     from: Units.N_PER_CM2,
          //     to: Units.KGF_PER_CM2,
          //     round: 2,
          //     min: 0.1,
          //     max: 5,
          //   }),
          // }),
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
          conditions: { [type.key]: (v) => v === TestType.compressive_strength },
          Component: CompressiveStrengthDynamicForm,
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
          conditions: { [type.key]: (v) => v === TestType.compressive_strength },
          Component: CompressiveStrengthDynamicForm,
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
          SamplesMoldingSandRecipe['1C'],
          SamplesMoldingSandRecipe['1XC'],
          SamplesMoldingSandRecipe['1C1C'],
          SamplesMoldingSandRecipe['1C2C'],
        ],
      },
      children: [
        // Міцність на розрив зразу
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_after_0_hours },
          Component: TensileStrengthAfter0HoursDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність на розрив через 1 год
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_after_1_hour },
          Component: TensileStrengthAfter1HourDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність на розрив через 3 год
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_after_3_hours },
          Component: TensileStrengthAfter3HoursDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Міцність на розрив через 24 год
        {
          conditions: { [type.key]: (v) => v === TestType.tensile_strength_after_24_hours },
          Component: TensileStrengthAfter24HoursDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
        // Газоутворююча властивість
        {
          conditions: { [type.key]: (v) => v === TestType.gas_forming_property },
          Component: GasFormingPropertyDynamicForm,
          schema: z.object({
            [measurement1.key]: zn(z.number()),
          }),
        },
      ],
    },
  ],
})
