import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import type { OrganizationShortResponse } from "../../../../features/admin/organizations/types/response.dto"

export const adminOrganizationsColumns: ColumnDef<
  OrganizationShortResponse,
  string
>[] = [
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
    accessorKey: "countryName",
    header: "Країна",
    size: 110,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "legalName",
    header: "Назва",
    size: 105,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "registrationNumber",
    header: "Реєстраційний номер",
    size: 225,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "taxId",
    header: "Налоговий номер",
    size: 200,
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
