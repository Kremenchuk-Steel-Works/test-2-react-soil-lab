import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { CountryShortResponse } from "../../../../features/admin/country/types/response.dto"

export const adminCountryColumns: ColumnDef<CountryShortResponse, string>[] = [
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
    accessorKey: "code",
    header: "Code",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "nameLocal",
    header: "Name Local",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
