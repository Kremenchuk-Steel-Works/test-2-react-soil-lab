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
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "isActive",
    header: "Активний?",
    size: 140,
    cell: ({ getValue }) => (getValue() ? "Так" : "Ні"),
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      const displayValue = row.getValue<boolean>(columnId) ? "Так" : "Ні"
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "isSuperuser",
    header: "Адмін?",
    size: 115,
    cell: ({ getValue }) => (getValue() ? "Так" : "Ні"),
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      const displayValue = row.getValue<boolean>(columnId) ? "Так" : "Ні"
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "fullName",
    header: "Повне ім'я",
    size: 145,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "lastLoginAt",
    header: "Останній вхід",
    size: 165,
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
    header: "Роль",
    size: 95,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorFn: (row) => row.permissionNames.join(", "),
    id: "permissionNames",
    header: "Права доступу",
    size: 175,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
