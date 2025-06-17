import { createColumnHelper } from "@tanstack/react-table"
import type { UserShortResponse } from "../../../../features/admin/users/types/response.dto"
import { booleanColumn } from "../../../../components/Table/columns/booleanColumn"
import { dateColumn } from "../../../../components/Table/columns/dateColumn"
import { idColumn } from "../../../../components/Table/columns/idColumn"
import { listColumn } from "../../../../components/Table/columns/listColumn"
import { displayColumn } from "../../../../components/Table/columns/displayColumn"

const columnHelper = createColumnHelper<UserShortResponse>()

export const adminUsersColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    ...idColumn(),
  }),

  columnHelper.accessor("email", {
    header: "Email",
    size: 100,
    ...displayColumn(),
  }),

  columnHelper.accessor("isActive", {
    header: "Активний?",
    size: 140,
    ...booleanColumn(),
  }),

  columnHelper.accessor("isSuperuser", {
    header: "Адмін?",
    size: 115,
    ...booleanColumn(),
  }),

  columnHelper.accessor("fullName", {
    header: "Повне ім'я",
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor("lastLoginAt", {
    header: "Останній вхід",
    size: 165,
    ...dateColumn(),
  }),

  columnHelper.accessor("roleNames", {
    header: "Роль",
    size: 95,
    ...listColumn(),
  }),

  columnHelper.accessor("permissionNames", {
    header: "Права доступу",
    size: 175,
    ...listColumn(),
  }),
]
