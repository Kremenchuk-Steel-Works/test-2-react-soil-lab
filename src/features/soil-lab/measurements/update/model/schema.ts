import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { measurementsBaseFormSchema } from '@/entities/soil-lab/measurements'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const measurementsUpdateFormSchema = measurementsBaseFormSchema.extend({
  performedAt: zn(z.string().datetime().nullable().optional()),
})
export const measurementsUpdateFormDefaultValues: DeepPartial<MeasurementsUpdateFormFields> = {}

export type MeasurementsUpdateFormFields = z.infer<typeof measurementsUpdateFormSchema>
