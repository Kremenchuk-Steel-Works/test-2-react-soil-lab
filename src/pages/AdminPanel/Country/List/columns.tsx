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
    accessorKey: "name",
    header: "Назва",
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "nameLocal",
    header: "Локальна назва",
    size: 110,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "code",
    header: "Код-2",
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
