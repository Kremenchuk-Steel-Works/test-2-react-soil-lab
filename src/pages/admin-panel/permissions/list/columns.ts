import { createColumnHelper } from '@tanstack/react-table'
import type { PermissionListItemResponse } from '@/entities/admin/permissions/types/response.dto'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<PermissionListItemResponse>()

export const adminPermissionsColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),
  columnHelper.accessor('name', {
    header: 'Назва',
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor('departmentName', {
    header: 'Назва відділу',
    size: 100,
    ...displayColumn(),
  }),
]
