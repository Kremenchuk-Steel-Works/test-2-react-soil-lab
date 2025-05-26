import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { Permission } from "../../../../features/admin/permissions/types"

export const adminPermissionsColumns: ColumnDef<Permission, string>[] = [
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
    accessorKey: "departmentId",
    header: "Department ID",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
