import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { experimentsBaseFormSchema } from '@/entities/soil-lab/experiments/ui/form/schema'

export const experimentsCreateFormSchema = experimentsBaseFormSchema

export type ExperimentsCreateFormFields = z.infer<typeof experimentsCreateFormSchema>

export const experimentsCreateFormDefaultValues: DeepPartial<ExperimentsCreateFormFields> = {}
