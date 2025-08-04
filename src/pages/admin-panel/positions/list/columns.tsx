import { createColumnHelper } from '@tanstack/react-table'
import type { PositionListResponse } from '@/entities/admin/positions/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<ListDataType<PositionListResponse>>()

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
