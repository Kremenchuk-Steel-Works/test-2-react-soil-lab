import { createColumnHelper } from "@tanstack/react-table"
import type { PermissionListItemResponse } from "../../../../features/admin/permissions/types/response.dto"
import { idColumn } from "../../../../components/Table/idColumn"
import { displayColumn } from "../../../../components/Table/displayColumn"

const columnHelper = createColumnHelper<PermissionListItemResponse>()

export const adminPermissionsColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    ...idColumn(),
  }),
  columnHelper.accessor("name", {
    header: "Назва",
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor("departmentName", {
    header: "Назва відділу",
    size: 100,
    ...displayColumn(),
  }),
]
