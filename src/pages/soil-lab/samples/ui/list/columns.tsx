import { createColumnHelper } from '@tanstack/react-table'
import { AlertTriangle, CheckCircle, Circle } from 'lucide-react'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { samplesMixtures } from '@/entities/soil-lab/samples/model/mixtures'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import {
  TestStatus,
  TestType,
  type SampleListItemResponse,
  type TestShortResponse,
} from '@/shared/api/soil-lab/model'
import { labelFromDict } from '@/utils/dict'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<SampleListItemResponse>()
const { moldingSandRecipe, receivedAt } = samplesFieldRegistry
const testTypes = Object.keys(testsType) as TestType[]

type Props = {
  status: TestStatus
  children: React.ReactNode
  className?: string
}

function TestStatusPill({ status, children, className }: Props) {
  const map = {
    [TestStatus.passed]: {
      Icon: CheckCircle,
      cls: 'bg-green-50 text-green-700 border border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-700',
    },
    [TestStatus.failed]: {
      Icon: AlertTriangle,
      cls: 'bg-yellow-50 text-yellow-800 border border-yellow-400/70 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-600',
    },
    default: {
      Icon: Circle,
      cls: 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
    },
  } as const

  const { Icon, cls } = map[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] align-middle text-sm leading-none font-medium ${cls} ${className ?? ''}`}
    >
      <Icon className="relative top-[0.5px] h-4 w-4" strokeWidth={1.6} />
      <span className="leading-none">{children}</span>
    </span>
  )
}

export const samplesColumns = [
  columnHelper.accessor(receivedAt.key, {
    header: receivedAt.label.default,
    size: 180,
    ...linkColumn(dateColumn(), {
      getHref: ({ row }) => row.original.id,
    }),
  }),
  columnHelper.accessor(moldingSandRecipe.key, {
    header: moldingSandRecipe.label.default,
    size: 200,
    ...displayColumn({
      formatter: (value) => <>{labelFromDict(samplesMixtures, value)}</>,
    }),
  }),

  ...testTypes.map((type) =>
    columnHelper.accessor((row) => row.tests?.find((t) => t.type === type) ?? null, {
      id: `test_${type}`,
      header: labelFromDict(testsType, type),
      size: 220,
      enableResizing: true,
      ...displayColumn<SampleListItemResponse, TestShortResponse | null>({
        formatter: (test) => {
          if (!test) return '—'

          const unit = testTypeToUnit(type)
          const value =
            test.meanMeasurement != null
              ? `${test.meanMeasurement} ${unit}`
              : labelFromDict(testsStatus, test.status)
          const title = labelFromDict(testsStatus, test.status)

          return (
            <TestStatusPill status={test.status} className="w-fit">
              <span title={title}>{value}</span>
            </TestStatusPill>
          )
        },
      }),
    }),
  ),
]
