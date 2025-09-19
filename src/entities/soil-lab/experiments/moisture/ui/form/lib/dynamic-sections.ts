import z from 'zod'
import { MACHINE_TYPES } from '@/entities/soil-lab/experiments/model/machineTypes'
import { MIXTURES } from '@/entities/soil-lab/experiments/model/mixtures'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { MoistureContentPercentDynamicForm } from '@/entities/soil-lab/experiments/moisture/ui/form/components/MoistureContentPercentDynamicForm'
import { createScopedSectionsConfig } from '@/shared/lib/zod/dynamic-sections-scoped'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType, ambientTempMoldAssemblyArea, moistureContentPercent } =
  moistureFieldRegistry

export const moistureContentPercentFormSchema = z.object({
  [moistureContentPercent.key]: zn(z.number()),
})

export type MoistureContentPercentFormFields = z.infer<typeof moistureContentPercentFormSchema>

export const experimentsMoistureDynamicSections = createScopedSectionsConfig({
  [moistureContentPercent.key]: [
    // Суміш 13
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['13'] },
      Component: MoistureContentPercentDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          children: [
            {
              conditions: { [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18 },
              schema: z.object({
                [moistureContentPercent.key]: zn(z.number().min(2.6).max(3.1)),
              }),
            },
            {
              conditions: { [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18 },
              schema: z.object({
                [moistureContentPercent.key]: zn(z.number().min(2.5).max(3.0)),
              }),
            },
          ],
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [moistureContentPercent.key]: zn(z.number().min(2.3).max(3)),
          }),
        },
      ],
    },

    // Суміш 14
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['14'] },
      Component: MoistureContentPercentDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          children: [
            {
              conditions: { [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18 },
              schema: z.object({
                [moistureContentPercent.key]: zn(z.number().min(3.4).max(3.7)),
              }),
            },
            {
              conditions: { [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18 },
              schema: z.object({
                [moistureContentPercent.key]: zn(z.number().min(3.3).max(3.5)),
              }),
            },
          ],
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [moistureContentPercent.key]: zn(z.number().min(3.2).max(3.5)),
          }),
        },
      ],
    },

    // Суміш 15
    {
      conditions: { [moldingSandNumber.key]: (v) => v === MIXTURES['15'] },
      Component: MoistureContentPercentDynamicForm,
      children: [
        // Змішувач
        {
          conditions: { [machineType.key]: (v) => v === MACHINE_TYPES.mixer },
          children: [
            {
              conditions: { [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18 },
              schema: z.object({
                [moistureContentPercent.key]: zn(z.number().min(2.6).max(3.1)),
              }),
            },
            {
              conditions: { [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18 },
              schema: z.object({
                [moistureContentPercent.key]: zn(z.number().min(2.5).max(3.0)),
              }),
            },
          ],
        },
        // АФЛ
        {
          conditions: { [machineType.key]: [MACHINE_TYPES.afl2, MACHINE_TYPES.afl3] },
          schema: z.object({
            [moistureContentPercent.key]: zn(z.number().min(2.3).max(3.3)),
          }),
        },
      ],
    },
  ],
})
