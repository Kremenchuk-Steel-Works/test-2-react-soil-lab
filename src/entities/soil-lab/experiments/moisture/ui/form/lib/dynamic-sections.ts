import z from 'zod'
import { MIXTURES } from '@/entities/soil-lab/experiments/model/mixtures'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { MoistureContentPercentDynamicForm } from '@/entities/soil-lab/experiments/moisture/ui/form/components/MoistureContentPercentDynamicForm'
import { createSectionsConfig } from '@/shared/lib/zod/dynamic-schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, ambientTempMoldAssemblyArea, moistureContentPercent } =
  moistureFieldRegistry

export const moistureContentPercentFormSchema = z.object({
  [moistureContentPercent.key]: zn(z.number()),
})

export type MoistureContentPercentFormFields = z.infer<typeof moistureContentPercentFormSchema>

export const experimentsMoistureDynamicSections = createSectionsConfig({
  // Секции
  [moistureContentPercent.key]: [
    // Смесь 13
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['13'],
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(2.6).max(3.1)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['13'],
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(2.5).max(3.0)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
    // Смесь 14
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['14'],
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(3.4).max(3.7)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['14'],
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(3.3).max(3.5)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
    // Смесь 15
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['15'],
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(2.6).max(3.1)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['15'],
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(2.5).max(3.0)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
  ],
})

// export const experimentsMoistureDynamicSections: DynamicSectionsConfig =
//   buildDynamicSectionsFromExperimentConfig(experimentsMoistureConfig, {
//     mixtureFieldKey: moldingSandNumber.key,
//     componentByField: {
//       [moistureContentPercent.key]: MoistureContentPercentDynamicForm,
//     },
//   })
