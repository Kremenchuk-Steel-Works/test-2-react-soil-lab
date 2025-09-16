import { z } from 'zod'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisure/model/fields-registry'
import { MoistureContentPercentDynamicForm } from '@/entities/soil-lab/experiments/moisure/ui/form/components/AmbientTempMoldAssemblyAreaDynamicSections'
import { createSectionsConfig, type DynamicSectionsConfig } from '@/shared/lib/zod/dynamic-schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { ambientTempMoldAssemblyArea, moistureContentPercent } = moistureFieldRegistry

export const moistureContentPercentFormSchema = z.object({
  [moistureContentPercent.key]: zn(z.number()),
})

export type MoistureContentPercentFormFields = z.infer<typeof moistureContentPercentFormSchema>

export const experimentsMoistureDynamicSections = createSectionsConfig({
  // Для температур
  [ambientTempMoldAssemblyArea.key]: [
    {
      id: '>=18',
      conditions: {
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) >= 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(2.6).max(3.1)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
    {
      id: '<18',
      conditions: {
        [ambientTempMoldAssemblyArea.key]: (v) => Number(v) < 18,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number().min(2.5).max(3.0)),
      }),
      Component: MoistureContentPercentDynamicForm,
    },
  ],
} as const satisfies DynamicSectionsConfig)
