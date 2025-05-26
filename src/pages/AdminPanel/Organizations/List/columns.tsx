import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { Organization } from "../../../../features/admin/organizations/types"

export const adminOrganizationsColumns: ColumnDef<Organization, string>[] = [
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
    accessorKey: "country",
    header: "Country",
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
