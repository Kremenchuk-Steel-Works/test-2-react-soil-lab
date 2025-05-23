import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { User } from "../../../../features/users/types"

export const adminUsersColumns: ColumnDef<User, string>[] = [
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
    accessorKey: "personId",
    header: "Person ID",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
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
    accessorKey: "lastLoginAt",
    header: "Last Login",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    filterFn: (row, columnId, filterValue) => {
      const displayValue = new Date(
        row.getValue<string>(columnId)
      ).toLocaleString()
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    filterFn: (row, columnId, filterValue) => {
      const displayValue = new Date(
        row.getValue<string>(columnId)
      ).toLocaleString()
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
]
