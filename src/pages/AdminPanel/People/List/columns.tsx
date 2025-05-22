import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { Person } from "../../../../features/people/types"

export const adminPeopleColumns: ColumnDef<Person, string>[] = [
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
    accessorKey: "first_name",
    header: "First Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "middle_name",
    header: "Middle Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "birth_date",
    header: "Birth Date",
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue()).toLocaleDateString() : "",
    filterFn: (row, columnId, filterValue) => {
      const displayValue = new Date(
        row.getValue<string>(columnId)
      ).toLocaleDateString()
      return displayValue.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
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
  {
    accessorKey: "updated_at",
    header: "Updated",
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
