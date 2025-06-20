import { createColumnHelper } from '@tanstack/react-table'
import type { PositionShortResponse } from '@/entities/admin/positions/types/response.dto'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<PositionShortResponse>()

export const adminPositionsColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),
  columnHelper.accessor('name', {
    header: 'Назва',
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor('description', {
    header: 'Опис',
    size: 100,
    ...displayColumn(),
  }),
]
