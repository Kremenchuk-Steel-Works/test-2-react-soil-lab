import { createColumnHelper } from '@tanstack/react-table'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsResponseFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsTypeOptions } from '@/entities/soil-lab/tests/model/type'
import { TestStatusPill } from '@/entities/soil-lab/tests/ui/status-pill/TestStatusPill'
import { type TestListItemResponse } from '@/shared/api/soil-lab/model'
import { labelFromDict } from '@/utils/dict'
import { dateColumn, displayColumn, linkColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<TestListItemResponse>()
const { createdAt, type, meanMeasurement } = testsResponseFieldRegistry

export const testsColumns = [
  columnHelper.accessor(createdAt.key, {
    header: createdAt.label.default,
    size: 60,
    ...linkColumn(dateColumn(), {
      getHref: ({ row }) => row.original.id,
    }),
  }),

  columnHelper.accessor(type.key, {
    header: type.label.default,
    size: 55,
    ...optionColumn(testsTypeOptions),
  }),

  columnHelper.accessor(meanMeasurement.key, {
    header: meanMeasurement.label.default,
    size: 75,
    ...displayColumn<TestListItemResponse, number>({
      formatter: (value, row) => {
        if (!value) return '—'

        const unit = testTypeToUnit(row.type)
        const unitValue = `${value} ${unit}`
        const title = labelFromDict(testsStatus, row.status)

        return (
          <TestStatusPill status={row.status}>
            <span title={title}>{unitValue}</span>
          </TestStatusPill>
        )
      },
    }),
  }),
]
