import { createColumnHelper } from '@tanstack/react-table'
import type { PermissionShortResponse, RoleListResponse } from '@/shared/api/soil-lab/model'
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
    ...listColumn<ListDataType<RoleListResponse>, PermissionShortResponse>({
      formatter: (role) => role.name,
    }),
  }),
]
