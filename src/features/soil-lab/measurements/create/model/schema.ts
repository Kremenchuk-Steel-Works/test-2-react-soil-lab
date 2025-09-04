import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { measurementsBaseFormSchema } from '@/entities/soil-lab/measurements'

export const measurementsCreateFormSchema = measurementsBaseFormSchema
export const measurementsCreateFormDefaultValues: DeepPartial<MeasurementsCreateFormFields> = {}

export type MeasurementsCreateFormFields = z.infer<typeof measurementsCreateFormSchema>
