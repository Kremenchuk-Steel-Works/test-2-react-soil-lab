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
    header: "CountryName",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "legalName",
    header: "LegalName",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "registrationNumber",
    header: "RegistrationNumber",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "taxId",
    header: "TaxId",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
]
