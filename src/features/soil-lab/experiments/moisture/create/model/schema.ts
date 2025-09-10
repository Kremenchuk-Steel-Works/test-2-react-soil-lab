import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { EXPERIMENTS as FR } from '@/entities/soil-lab/experiments/model/fields-registry'
import { moistureBaseFormSchema } from '@/entities/soil-lab/experiments/ui/form/schema'

export const moistureCreateFormSchema = moistureBaseFormSchema

export type MoistureCreateFormFields = z.infer<typeof moistureCreateFormSchema>

export const moistureCreateFormDefaultValues: DeepPartial<MoistureCreateFormFields> = {
  [FR.measurements.key]: [
    { [FR.moistureContentPercent.key]: undefined },
    { [FR.moistureContentPercent.key]: undefined },
  ],
}
