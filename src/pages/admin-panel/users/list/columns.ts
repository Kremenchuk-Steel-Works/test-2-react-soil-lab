import { createColumnHelper } from "@tanstack/react-table"
import type { UserShortResponse } from "../../../../entities/admin/users/types/response.dto"
import { booleanColumn } from "../../../../widgets/DataTable/columns/booleanColumn"
import { dateColumn } from "../../../../widgets/DataTable/columns/dateColumn"
import { idColumn } from "../../../../widgets/DataTable/columns/idColumn"
import { listColumn } from "../../../../widgets/DataTable/columns/listColumn"
import { displayColumn } from "../../../../widgets/DataTable/columns/displayColumn"

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
