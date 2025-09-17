import z from 'zod'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { MACHINE_TYPES } from '@/entities/soil-lab/experiments/model/machineTypes'
import { MIXTURES } from '@/entities/soil-lab/experiments/model/mixtures'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { strengthFieldRegistry } from '@/entities/soil-lab/experiments/strength/model/fields-registry'
import { Experiments13Afl2ContentDynamicForm } from '@/entities/soil-lab/experiments/ui/form/components/ExperimentsContentDynamicForm'
import { createSectionsConfig } from '@/shared/lib/zod/dynamic-schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType } = experimentsFieldRegistry

const { moistureContentPercent } = moistureFieldRegistry

const { compressiveStrength } = strengthFieldRegistry

// export const experimentsContentFormSchema = z.object({
//   [experimentsContentPercent.key]: zn(z.number()),
// })

// export type ExperimentsContentFormFields = z.infer<typeof experimentsContentFormSchema>

export const experimentsDynamicSections = createSectionsConfig({
  // Секции
  experimentsContentDynamic: [
    // Смесь 13
    {
      conditions: {
        [moldingSandNumber.key]: (v) => v === MIXTURES['13'],
        [machineType.key]: (v) => v === MACHINE_TYPES.afl2,
      },
      schema: z.object({
        [moistureContentPercent.key]: zn(z.number()),
        [compressiveStrength.key]: zn(z.number()),
      }),
      Component: Experiments13Afl2ContentDynamicForm,
    },
  ],
})
