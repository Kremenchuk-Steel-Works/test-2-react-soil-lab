import { createColumnHelper } from '@tanstack/react-table'
import type { MoldPassportListItemResponse } from '@/shared/api/mold-passport/model'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<MoldPassportListItemResponse>()

export const measurementsColumns = [
  columnHelper.accessor('moldingSandNumber', {
    header: '№ суміші',
    size: 145,
    ...linkColumn(),
  }),

  columnHelper.accessor('moldingSandStrengthKgfCm2', {
    header: 'Міцність на стиск (кгс/см²)',
    size: 100,
    ...displayColumn(),
  }),

  columnHelper.accessor('moldingSandGasPermeability', {
    header: 'Газопроникність (од.)',
    size: 155,
    ...displayColumn(),
  }),

  columnHelper.accessor('moldingSandMoisturePercent', {
    header: 'Вологість (%)',
    size: 155,
    ...displayColumn(),
  }),

  columnHelper.accessor('performedAt', {
    header: 'Дата й час вимірювання',
    size: 115,
    ...dateColumn(),
  }),

  columnHelper.accessor('note', {
    header: 'Примітка',
    size: 155,
    ...displayColumn(),
  }),
]
