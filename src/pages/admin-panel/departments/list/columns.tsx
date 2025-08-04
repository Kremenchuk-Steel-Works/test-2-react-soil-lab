import { createColumnHelper } from '@tanstack/react-table'
import type { DepartmentListResponse } from '@/entities/admin/departments/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<ListDataType<DepartmentListResponse>>()

export const adminDepartmentsColumns = [
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
