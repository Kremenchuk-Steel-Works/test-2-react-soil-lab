import { createColumnHelper } from '@tanstack/react-table'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { testsStatusOptions } from '@/entities/soil-lab/tests/model/status'
import { testsTypeOptions } from '@/entities/soil-lab/tests/model/type'
import type { SampleListItemResponse, TestShortResponse } from '@/shared/api/soil-lab/model'
import { dateColumn, displayColumn, linkColumn } from '@/widgets/data-table'
import { objectColumn } from '@/widgets/data-table/columns/objectColumns'
import { vf } from '@/widgets/data-table/columns/value-formatters'

const columnHelper = createColumnHelper<SampleListItemResponse>()
const { moldingSandRecipe, receivedAt, tests } = samplesFieldRegistry

export const samplesColumns = [
  columnHelper.accessor(receivedAt.key, {
    header: receivedAt.label.default,
    size: 175,
    ...linkColumn(dateColumn(), {
      getHref: ({ row }) => row.original.id,
    }),
  }),

  columnHelper.accessor(moldingSandRecipe.key, {
    header: moldingSandRecipe.label.default,
    size: 140,
    ...displayColumn(),
  }),

  columnHelper.accessor(tests.key, {
    header: tests.label.default,
    size: 1500,
    ...objectColumn<TestShortResponse, SampleListItemResponse>({
      pick: ['type', 'meanMeasurement', 'status'] as const,
      labels: { type: 'Тип', meanMeasurement: 'Средн.', status: 'Статус' },
      format: {
        type: vf.option(testsTypeOptions),
        meanMeasurement: vf.display(),
        status: vf.option(testsStatusOptions),
      },
      layout: 'inline',
      itemSeparator: ' | ',
      itemKey: ({ item }) => item.id,
      getItemHref: ({ item }) => `../tests/${item.id}`,
    }),
  }),
]
