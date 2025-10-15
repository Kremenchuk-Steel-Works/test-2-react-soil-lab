import { createColumnHelper } from '@tanstack/react-table'
import { samplesMaterialsLabels } from '@/entities/soil-lab/materials/model/materials'
import { samplesMaterialSourcesLabels } from '@/entities/soil-lab/materialSources/model/materialSources'
import {
  samplesParametersLabels,
  type SamplesParameters,
} from '@/entities/soil-lab/parameters/model/parameters'
import { samplesResponseFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsStatusLabels } from '@/entities/soil-lab/tests/model/status'
import { testsTypeLabels } from '@/entities/soil-lab/tests/model/type'
import { TestStatusPill } from '@/entities/soil-lab/tests/ui/status-pill/TestStatusPill'
import {
  type MaterialShortResponse,
  type MaterialSourceShortResponse,
  type SampleListItemResponse,
  type TestResultShortResponse,
} from '@/shared/api/soil-lab/model'
import { labelFromDict } from '@/utils/dict'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<SampleListItemResponse>()
const { material, materialSource, receivedAt } = samplesResponseFieldRegistry
const samplesParameters = Object.keys(samplesParametersLabels) as SamplesParameters[]

export const samplesColumns = [
  columnHelper.accessor(receivedAt.key, {
    header: receivedAt.label.default,
    size: 190,
    ...linkColumn(dateColumn(), {
      getHref: ({ row }) => row.original.id,
    }),
  }),

  columnHelper.accessor(materialSource.key, {
    header: materialSource.label.default,
    size: 220,
    ...displayColumn({
      formatter: (value: MaterialSourceShortResponse) => (
        <>{labelFromDict(samplesMaterialSourcesLabels, value.code)}</>
      ),
    }),
  }),

  columnHelper.accessor(material.key, {
    header: material.label.default,
    size: 220,
    ...displayColumn({
      formatter: (value: MaterialShortResponse) => (
        <>{labelFromDict(samplesMaterialsLabels, value.name)}</>
      ),
    }),
  }),

  ...samplesParameters.map((parameterCode) =>
    columnHelper.accessor(
      (row) => row.testResults?.find((t) => t.parameter.code === parameterCode) ?? null,
      {
        header: labelFromDict(testsTypeLabels, parameterCode),
        size: 220,
        ...displayColumn<SampleListItemResponse, TestResultShortResponse | null>({
          formatter: (test) => {
            if (!test) return '—'

            const unit = testTypeToUnit(parameterCode)
            const unitValue = `${test.meanValue} ${unit}`
            const title = labelFromDict(testsStatusLabels, test.isCompliant)

            return (
              <TestStatusPill isCompliant={test.isCompliant}>
                <span title={title}>{unitValue}</span>
              </TestStatusPill>
            )
          },
        }),
      },
    ),
  ),
]
