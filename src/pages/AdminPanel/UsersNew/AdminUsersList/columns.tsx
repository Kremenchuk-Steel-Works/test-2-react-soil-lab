import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { User } from "../../../../features/user/types"

export const adminPeopleColumns: ColumnDef<User, string>[] = [
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
    accessorKey: "person_id",
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
    accessorKey: "is_active",
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
    accessorKey: "last_login_at",
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
    accessorKey: "created_at",
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
