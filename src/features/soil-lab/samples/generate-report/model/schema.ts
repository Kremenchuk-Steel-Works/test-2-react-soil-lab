import { addDays, format } from 'date-fns'
import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { samplesGenerateReportFieldRegistry } from '@/features/soil-lab/samples/generate-report/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { dateFrom, dateTo } = samplesGenerateReportFieldRegistry

export const samplesGenerateReportFormSchema = z.object({
  [dateFrom.key]: zn(z.string().date().nullable()),
  [dateTo.key]: zn(z.string().date().nullable()),
})
export type SamplesGenerateReportFormFields = z.infer<typeof samplesGenerateReportFormSchema>

export const samplesGenerateReportFormDefaultValues: DeepPartial<SamplesGenerateReportFormFields> =
  {
    dateFrom: format(new Date(), 'yyyy-MM-dd'),
    dateTo: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  }
