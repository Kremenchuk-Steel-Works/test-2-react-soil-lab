import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { PositionShortResponse } from "../../../../features/admin/positions/types/response.dto"

export const adminPositionsColumns: ColumnDef<PositionShortResponse, string>[] =
  [
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
