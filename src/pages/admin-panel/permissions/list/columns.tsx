import { createColumnHelper } from '@tanstack/react-table'
import type { PermissionListResponse } from '@/entities/admin/permissions/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { linkColumn } from '@/widgets/data-table/columns/linkColumn'

const columnHelper = createColumnHelper<ListDataType<PermissionListResponse>>()

export const adminPermissionsColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...linkColumn(),
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
