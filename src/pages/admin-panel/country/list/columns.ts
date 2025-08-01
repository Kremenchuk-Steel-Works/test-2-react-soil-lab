import { createColumnHelper } from '@tanstack/react-table'
import type { CountryShortResponse } from '@/entities/admin/country/types/response.dto'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<CountryShortResponse>()

export const adminCountryColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),
  columnHelper.accessor('name', {
    header: 'Назва',
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor('isoAlpha2', {
    header: 'Код-2',
    size: 100,
    ...displayColumn(),
  }),
]
