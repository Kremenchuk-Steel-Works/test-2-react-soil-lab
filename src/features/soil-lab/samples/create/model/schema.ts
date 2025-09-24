import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { samplesBaseFormSchema } from '@/entities/soil-lab/samples/ui/form/schema'

export const samplesCreateFormSchema = samplesBaseFormSchema
export type SamplesCreateFormFields = z.infer<typeof samplesCreateFormSchema>

export const samplesCreateFormDefaultValues: DeepPartial<SamplesCreateFormFields> = {
  receivedAt: new Date().toISOString(),
}
