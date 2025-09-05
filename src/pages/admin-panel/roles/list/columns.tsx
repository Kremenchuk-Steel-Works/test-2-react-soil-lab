import { createColumnHelper } from '@tanstack/react-table'
import type { PermissionListItemResponse } from '@/entities/admin-old/permissions/types/response.dto'
import type { RoleListResponse } from '@/entities/admin-old/roles/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { linkColumn } from '@/widgets/data-table/columns/linkColumn'
import { listColumn } from '@/widgets/data-table/columns/listColumn'

const columnHelper = createColumnHelper<ListDataType<RoleListResponse>>()

export const adminRolesColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...linkColumn(),
  }),
  columnHelper.accessor('name', {
    header: 'Назва',
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor('permissions', {
    header: 'Права доступу',
    size: 100,
    ...listColumn<ListDataType<RoleListResponse>, PermissionListItemResponse>({
      formatter: (role) => role.name,
    }),
  }),
]
