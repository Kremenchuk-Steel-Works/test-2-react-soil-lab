import { createColumnHelper } from '@tanstack/react-table'
import { testsResponseFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { testsStatusOptions } from '@/entities/soil-lab/tests/model/status'
import { testsTypeOptions } from '@/entities/soil-lab/tests/model/type'
import type { TestListItemResponse } from '@/shared/api/soil-lab-2/model'
import { dateColumn, displayColumn, linkColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<TestListItemResponse>()
const { createdAt, status, type, meanMeasurement } = testsResponseFieldRegistry

export const testsColumns = [
  columnHelper.accessor(createdAt.key, {
    header: createdAt.label.default,
    size: 60,
    ...linkColumn(dateColumn(), {
      getHref: ({ row }) => row.original.id,
    }),
  }),

  columnHelper.accessor(status.key, {
    header: status.label.default,
    size: 55,
    ...optionColumn(testsStatusOptions),
  }),

  columnHelper.accessor(type.key, {
    header: type.label.default,
    size: 55,
    ...optionColumn(testsTypeOptions),
  }),

  columnHelper.accessor(meanMeasurement.key, {
    header: meanMeasurement.label.default,
    size: 75,
    ...displayColumn(),
  }),
]
