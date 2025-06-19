import { createColumnHelper } from "@tanstack/react-table"
import type { RoleShortResponse } from "../../../../entities/admin/roles/types/response.dto"
import { idColumn } from "../../../../widgets/data-table/columns/idColumn"
import { displayColumn } from "../../../../widgets/data-table/columns/displayColumn"
import { listColumn } from "../../../../widgets/data-table/columns/listColumn"
import type { PermissionListItemResponse } from "../../../../entities/admin/permissions/types/response.dto"

const columnHelper = createColumnHelper<RoleShortResponse>()

export const adminRolesColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    ...idColumn(),
  }),
  columnHelper.accessor("name", {
    header: "Назва",
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor("permissions", {
    header: "Права доступу",
    size: 100,
    ...listColumn<RoleShortResponse, PermissionListItemResponse>({
      formatter: (role) => role.name,
    }),
  }),
]
