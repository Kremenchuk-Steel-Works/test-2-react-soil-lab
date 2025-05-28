import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { PersonListItemResponse } from "../../../../features/admin/people/types/response.dto"

export const adminPeopleColumns: ColumnDef<PersonListItemResponse, string>[] = [
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
    accessorKey: "firstName",
    header: "First Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "middleName",
    header: "Middle Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "lastName",
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
    accessorKey: "birthDate",
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
    accessorKey: "phoneNumber",
    header: "Phone",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
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
  {
    accessorKey: "updatedAt",
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
