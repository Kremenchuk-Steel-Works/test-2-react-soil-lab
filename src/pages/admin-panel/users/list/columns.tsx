import { createColumnHelper } from '@tanstack/react-table'
import type { UserListResponse } from '@/entities/admin/users/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { booleanColumn } from '@/widgets/data-table/columns/booleanColumn'
import { dateColumn } from '@/widgets/data-table/columns/dateColumn'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { linkColumn } from '@/widgets/data-table/columns/linkColumn'
import { listColumn } from '@/widgets/data-table/columns/listColumn'

const columnHelper = createColumnHelper<ListDataType<UserListResponse>>()

export const adminUsersColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...linkColumn(),
  }),

  columnHelper.accessor('email', {
    header: 'Email',
    size: 100,
    ...displayColumn(),
  }),

  columnHelper.accessor('isActive', {
    header: 'Активний?',
    size: 140,
    ...booleanColumn(),
  }),

  columnHelper.accessor('isSuperuser', {
    header: 'Адмін?',
    size: 115,
    ...booleanColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: "Повне ім'я",
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('lastLoginAt', {
    header: 'Останній вхід',
    size: 165,
    ...dateColumn(),
  }),

  columnHelper.accessor('roleNames', {
    header: 'Роль',
    size: 95,
    ...listColumn(),
  }),

  columnHelper.accessor('permissionNames', {
    header: 'Права доступу',
    size: 175,
    ...listColumn(),
  }),
]
