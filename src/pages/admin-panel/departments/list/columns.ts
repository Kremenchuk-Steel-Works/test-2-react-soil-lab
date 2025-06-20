import { createColumnHelper } from '@tanstack/react-table'
import type { DepartmentShortResponse } from '@/entities/admin/departments/types/response.dto'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<DepartmentShortResponse>()

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
