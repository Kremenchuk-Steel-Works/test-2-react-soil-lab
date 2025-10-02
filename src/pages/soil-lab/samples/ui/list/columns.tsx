import { createColumnHelper } from '@tanstack/react-table'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { samplesMixtures } from '@/entities/soil-lab/samples/model/mixtures'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import { TestStatusPill } from '@/entities/soil-lab/tests/ui/status-pill/TestStatusPill'
import {
  TestType,
  type SampleListItemResponse,
  type TestShortResponse,
} from '@/shared/api/soil-lab/model'
import { labelFromDict } from '@/utils/dict'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<SampleListItemResponse>()
const { moldingSandRecipe, receivedAt } = samplesFieldRegistry
const testTypes = Object.keys(testsType) as TestType[]

export const samplesColumns = [
  columnHelper.accessor(receivedAt.key, {
    header: receivedAt.label.default,
    size: 190,
    ...linkColumn(dateColumn(), {
      getHref: ({ row }) => row.original.id,
    }),
  }),
  columnHelper.accessor(moldingSandRecipe.key, {
    header: moldingSandRecipe.label.default,
    size: 220,
    ...displayColumn({
      formatter: (value) => <>{labelFromDict(samplesMixtures, value)}</>,
    }),
  }),

  ...testTypes.map((type) =>
    columnHelper.accessor((row) => row.tests?.find((t) => t.type === type) ?? null, {
      header: labelFromDict(testsType, type),
      size: 220,
      ...displayColumn<SampleListItemResponse, TestShortResponse | null>({
        formatter: (test) => {
          if (!test) return '—'

          const unit = testTypeToUnit(type)
          const unitValue = `${test.meanMeasurement} ${unit}`
          const title = labelFromDict(testsStatus, test.status)

          return (
            <TestStatusPill status={test.status}>
              <span title={title}>{unitValue}</span>
            </TestStatusPill>
          )
        },
      }),
    }),
  ),
]
