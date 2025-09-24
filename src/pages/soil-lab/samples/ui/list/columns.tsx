import { createColumnHelper } from '@tanstack/react-table'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import type { SampleListItemResponse } from '@/shared/api/soil-lab-2/model'
import { dateColumn, linkColumn, listColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<SampleListItemResponse>()
const { moldingSandRecipe, receivedAt, tests } = samplesFieldRegistry

export const samplesColumns = [
  columnHelper.accessor(moldingSandRecipe.key, {
    header: moldingSandRecipe.label.default,
    size: 60,
    ...linkColumn({ getHref: ({ row }) => row.original.id }),
  }),

  columnHelper.accessor(tests.key, {
    header: tests.label.default,
    size: 55,
    ...listColumn(),
  }),

  columnHelper.accessor(receivedAt.key, {
    header: receivedAt.label.default,
    size: 75,
    ...dateColumn(),
  }),
]
