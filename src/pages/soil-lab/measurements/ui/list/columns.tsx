import { createColumnHelper } from '@tanstack/react-table'
import { MEASUREMENTS as FR } from '@/entities/soil-lab/measurements/model/fields-registry'
import type { MoldPassportListItemResponse } from '@/shared/api/mold-passport/model'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<MoldPassportListItemResponse>()

export const measurementsColumns = [
  columnHelper.accessor(FR.moldingSandNumber.key, {
    header: FR.moldingSandNumber.label.default,
    size: 60,
    ...linkColumn(),
  }),

  columnHelper.accessor(FR.moldingSandStrengthKgfCm2.key, {
    header: FR.moldingSandStrengthKgfCm2.label.default,
    size: 110,
    ...displayColumn(),
  }),

  columnHelper.accessor(FR.moldingSandGasPermeability.key, {
    header: FR.moldingSandGasPermeability.label.default,
    size: 85,
    ...displayColumn(),
  }),

  columnHelper.accessor(FR.moldingSandMoisturePercent.key, {
    header: FR.moldingSandMoisturePercent.label.default,
    size: 55,
    ...displayColumn(),
  }),

  columnHelper.accessor(FR.performedAt.key, {
    header: FR.performedAt.label.default,
    size: 75,
    ...dateColumn(),
  }),

  columnHelper.accessor(FR.note.key, {
    header: FR.note.label.default,
    size: 70,
    ...displayColumn(),
  }),
]
