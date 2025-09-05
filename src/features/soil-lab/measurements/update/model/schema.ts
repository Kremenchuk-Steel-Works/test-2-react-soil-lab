import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { measurementsBaseFormSchema } from '@/entities/soil-lab/measurements'

export const measurementsUpdateFormSchema = measurementsBaseFormSchema
// export const measurementsUpdateFormSchema = measurementsBaseFormSchema.extend({
//   [FR.performedAt.key]: zn(z.string().datetime().nullable().optional()),
// })
export const measurementsUpdateFormDefaultValues: DeepPartial<MeasurementsUpdateFormFields> = {}

export type MeasurementsUpdateFormFields = z.infer<typeof measurementsUpdateFormSchema>
