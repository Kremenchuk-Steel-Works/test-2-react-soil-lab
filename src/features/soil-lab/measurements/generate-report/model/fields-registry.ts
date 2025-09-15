import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const measurementsGenerateReportFieldRegistry = createFieldRegistry({
  dateFrom: {
    label: { default: 'Від (дд.мм.рррр)' },
  },
  dateTo: {
    label: { default: 'До (дд.мм.рррр)' },
  },
} as const)
