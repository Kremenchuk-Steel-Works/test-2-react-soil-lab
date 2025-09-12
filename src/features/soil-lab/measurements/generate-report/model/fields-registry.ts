import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const measurementsGenerateReportFieldRegistry = createFieldRegistry({
  dateFrom: {
    label: { default: 'Дата й час від' },
  },
  dateTo: {
    label: { default: 'Дата й час до' },
  },
} as const)
