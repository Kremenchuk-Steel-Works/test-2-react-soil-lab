import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { samplesBaseFormSchema } from '@/entities/soil-lab/samples/ui/form/schema'

export const samplesCreateFormSchema = samplesBaseFormSchema
export const samplesCreateFormDefaultValues: DeepPartial<SamplesCreateFormFields> = {}

export type SamplesCreateFormFields = z.infer<typeof samplesCreateFormSchema>
