import { format } from 'date-fns'
import { measurementsService } from '@/entities/soil-lab/measurements'
import {
  measurementsGenerateReportFormDefaultValues,
  type MeasurementsGenerateReportFormFields,
} from '@/features/soil-lab/measurements/generate-report/model/schema'
import { MeasurementsGenerateReportForm } from '@/features/soil-lab/measurements/generate-report/ui/MeasurementsGenerateReportForm'
import { downloadFile } from '@/shared/lib/axios/downloadFile'

interface MeasurementsGenerateReportProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function MeasurementsGenerateReport({
  onSuccess,
  onError,
}: MeasurementsGenerateReportProps) {
  const { mutateAsync } = measurementsService.generateReport({
    mutation: {
      onSuccess: (res, { data }) => {
        // Форматируем даты, только если они существуют
        const formattedDateFrom = data.dateFrom
          ? format(new Date(data.dateFrom), 'dd_MM_yyyy')
          : null
        const formattedDateTo = data.dateTo ? format(new Date(data.dateTo), 'dd_MM_yyyy') : null

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

  const handleSubmit = async (data: MeasurementsGenerateReportFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <MeasurementsGenerateReportForm
      defaultValues={measurementsGenerateReportFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Завантажити"
    />
  )
}
