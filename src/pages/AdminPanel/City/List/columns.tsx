import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { CityShortResponse } from "../../../../features/admin/city/types/response.dto"

export const adminCityColumns: ColumnDef<CityShortResponse, string>[] = [
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
    accessorKey: "countryId",
    header: "ID Країни",
    size: 100,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
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
]
