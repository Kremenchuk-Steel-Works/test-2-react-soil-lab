import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisure/model/fields-registry'
import { moistureBaseFormSchema } from '@/entities/soil-lab/experiments/moisure/ui/form/schema'

const { measurements, moistureContentPercent } = moistureFieldRegistry

export const moistureCreateFormSchema = moistureBaseFormSchema

export type MoistureCreateFormFields = z.infer<typeof moistureCreateFormSchema>

export const moistureCreateFormDefaultValues: DeepPartial<MoistureCreateFormFields> = {
  [measurements.key]: [
    { [moistureContentPercent.key]: undefined },
    { [moistureContentPercent.key]: undefined },
  ],
}
