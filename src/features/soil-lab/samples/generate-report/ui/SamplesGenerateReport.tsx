import { format, parseISO } from 'date-fns'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import {
  samplesGenerateReportFormDefaultValues,
  type SamplesGenerateReportFormFields,
} from '@/features/soil-lab/samples/generate-report/model/schema'
import { SamplesGenerateReportForm } from '@/features/soil-lab/samples/generate-report/ui/SamplesGenerateReportForm'
import type { GetSamplesReportApiV1SamplesGenerateReportPostMutationResult } from '@/shared/api/soil-lab/endpoints/samples/samples'
import type { HTTPValidationError } from '@/shared/api/soil-lab/model'
import { downloadFile } from '@/shared/lib/axios/downloadFile'

interface SamplesGenerateReportProps {
  onSuccess?: (res: GetSamplesReportApiV1SamplesGenerateReportPostMutationResult) => void
  onError?: (err: HTTPValidationError) => void
}

function formatNullableDate(value: string | null | undefined): string | null | undefined {
  return value ? format(parseISO(value), 'dd_MM_yyyy') : null
}

export default function SamplesGenerateReport({ onSuccess, onError }: SamplesGenerateReportProps) {
  const { mutateAsync } = samplesService.generateReport({
    mutation: {
      onSuccess: (res, { data }) => {
        // Форматируем даты, только если они существуют
        const formattedDateFrom = formatNullableDate(data.dateFrom)
        const formattedDateTo = formatNullableDate(data.dateTo)

        let datePart = ''

        //  Условно формируем строку с датами
        if (formattedDateFrom && formattedDateTo) {
          datePart = `${formattedDateFrom}-${formattedDateTo}`
        } else if (formattedDateFrom) {
          datePart = `з ${formattedDateFrom}`
        } else if (formattedDateTo) {
          datePart = `до ${formattedDateTo}`
        }

        // Собираем финальное имя, добавляя часть с датой, только если она есть
        const fileName = `Звіт вимірювання суміші${datePart ? ` ${datePart}` : ''}`
        downloadFile(res, fileName)
        onSuccess?.(res)
      },
      onError: (err) => onError?.(err),
    },
  })

  const handleSubmit = async (data: SamplesGenerateReportFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <SamplesGenerateReportForm
      defaultValues={samplesGenerateReportFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Завантажити"
    />
  )
}
