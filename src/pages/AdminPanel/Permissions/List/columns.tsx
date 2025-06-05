import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { PermissionListItemResponse } from "../../../../features/admin/permissions/types/response.dto"

export const adminPermissionsColumns: ColumnDef<
  PermissionListItemResponse,
  string
>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    sortDescFirst: false,
    enableColumnFilter: true,
    filterFn: "includesString",
    cell: (row) => (
      <Link className="text-blue-500" to={row.getValue().toString()}>
        {row.getValue()}
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: "Назва",
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "departmentName",
    header: "Назва відділу",
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
