import { createColumnHelper } from '@tanstack/react-table'
import type { CityListResponse } from '@/entities/admin/city/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { linkColumn } from '@/widgets/data-table/columns/linkColumn'

const columnHelper = createColumnHelper<ListDataType<CityListResponse>>()

export const adminCityColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...linkColumn(),
  }),
  columnHelper.accessor('name', {
    header: 'Назва',
    size: 100,
    ...displayColumn(),
  }),
]
