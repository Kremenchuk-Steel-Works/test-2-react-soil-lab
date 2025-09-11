import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisure/model/fields-registry'
import { withNcm2ToKgfcm2Conversion } from '@/shared/lib/zod/zod-converters'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, ambientTempMoldAssemblyArea, measurements, moistureContentPercent } =
  moistureFieldRegistry

export const experimentsMeasurementFormSchema = z.object({
  [moistureContentPercent.key]: withNcm2ToKgfcm2Conversion(zn(z.number()), {
    min: 1,
    max: 5,
    round: 5,
  }),
})

export const moistureBaseFormSchema = z.object({
  [moldingSandNumber.key]: zn(z.string()),
  [ambientTempMoldAssemblyArea.key]: zn(z.number()),
  [measurements.key]: z.array(experimentsMeasurementFormSchema).min(2).max(3),
})

export type ExperimentsMeasurementFormFields = z.infer<typeof experimentsMeasurementFormSchema>

export const experimentsMeasurementFormDefaultValues: DeepPartial<ExperimentsMeasurementFormFields> =
  {}
