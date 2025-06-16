import { createColumnHelper } from "@tanstack/react-table"
import type { RoleShortResponse } from "../../../../features/admin/roles/types/response.dto"
import { idColumn } from "../../../../components/Table/idColumn"
import { displayColumn } from "../../../../components/Table/displayColumn"
import { listColumn } from "../../../../components/Table/listColumn"
import type { PermissionListItemResponse } from "../../../../features/admin/permissions/types/response.dto"

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
