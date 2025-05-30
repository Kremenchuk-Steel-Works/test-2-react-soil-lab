import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { RoleShortResponse } from "../../../../features/admin/roles/types/response.dto"

export const adminRolesColumns: ColumnDef<RoleShortResponse, string>[] = [
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
    header: "Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "description",
    header: "Description",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: (row) => {
      const permissions = row.row.original.permissions
      return (
        <div className="text-sm text-gray-800 dark:text-slate-200">
          {permissions.length > 0
            ? permissions.map((perm) => perm.name).join(", ")
            : "—"}
        </div>
      )
    },
  },
]
