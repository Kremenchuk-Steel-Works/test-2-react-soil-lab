import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { EXPERIMENTS as FR } from '@/entities/soil-lab/experiments/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const experimentsMeasurementFormSchema = z.object({
  [FR.moistureContentPercent.key]: zn(z.number()),
})

zn(z.number())

export const moistureBaseFormSchema = z.object({
  [FR.moldingSandNumber.key]: zn(z.string()),
  [FR.ambientTempMoldAssemblyArea.key]: zn(z.number()),
  [FR.measurements.key]: z.array(experimentsMeasurementFormSchema).min(2).max(3),
})

export type ExperimentsMeasurementFormFields = z.infer<typeof experimentsMeasurementFormSchema>

export const experimentsMeasurementFormDefaultValues: DeepPartial<ExperimentsMeasurementFormFields> =
  {}
