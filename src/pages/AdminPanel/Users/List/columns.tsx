import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { UserShortResponse } from "../../../../features/admin/users/types/response.dto"

export const adminUsersColumns: ColumnDef<UserShortResponse, string>[] = [
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
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      const displayValue = row.getValue<boolean>(columnId) ? "Yes" : "No"
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "isSuperuser",
    header: "Superuser",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      const displayValue = row.getValue<boolean>(columnId) ? "Yes" : "No"
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue()).toLocaleString() : "—",
    filterFn: (row, columnId, filterValue) => {
      const val = row.getValue<string | undefined>(columnId)
      const displayValue = val ? new Date(val).toLocaleString() : ""
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorFn: (row) => row.roleNames.join(", "),
    id: "roleNames",
    header: "Roles",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorFn: (row) => row.permissionNames.join(", "),
    id: "permissionNames",
    header: "Permissions",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
