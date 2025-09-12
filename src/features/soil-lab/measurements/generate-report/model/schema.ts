import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { measurementsGenerateReportFieldRegistry } from '@/features/soil-lab/measurements/generate-report/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { dateFrom, dateTo } = measurementsGenerateReportFieldRegistry

export const measurementsGenerateReportFormSchema = z.object({
  [dateFrom.key]: zn(z.string().date().nullable().optional()),
  [dateTo.key]: zn(z.string().date().nullable().optional()),
})

export const measurementsGenerateReportFormDefaultValues: DeepPartial<MeasurementsGenerateReportFormFields> =
  {}
export type MeasurementsGenerateReportFormFields = z.infer<
  typeof measurementsGenerateReportFormSchema
>
