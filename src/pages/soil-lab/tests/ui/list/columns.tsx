import { createColumnHelper } from '@tanstack/react-table'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsResponseFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { testsTypeOptions } from '@/entities/soil-lab/tests/model/type'
import { TestStatus, type TestListItemResponse } from '@/shared/api/soil-lab/model'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
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
      formatter: (value, row) =>
        row.status === TestStatus.passed ? (
          <AlertMessage type={AlertType.SUCCESS} message={`${value} ${testTypeToUnit(row.type)}`} />
        ) : (
          <AlertMessage type={AlertType.WARNING} message={`${value} ${testTypeToUnit(row.type)}`} />
        ),
    }),
  }),
]
