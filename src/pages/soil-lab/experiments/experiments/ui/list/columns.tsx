import { createColumnHelper } from '@tanstack/react-table'
import { MEASUREMENTS as FR } from '@/entities/soil-lab/measurements/model/fields-registry'
import type { MeasurementListItemResponse } from '@/shared/api/soil-lab/model'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<MeasurementListItemResponse>()

export const experimentsColumns = [
  columnHelper.accessor(FR.moldingSandNumber.key, {
    header: FR.moldingSandNumber.label.default,
    size: 60,
    ...linkColumn({ getHref: ({ row }) => row.original.id }),
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

  columnHelper.accessor(FR.createdAt.key, {
    header: FR.createdAt.label.default,
    size: 75,
    ...dateColumn(),
  }),
]
