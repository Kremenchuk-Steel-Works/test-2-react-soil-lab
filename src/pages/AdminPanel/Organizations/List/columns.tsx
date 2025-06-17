import { createColumnHelper } from "@tanstack/react-table"
import type { OrganizationShortResponse } from "../../../../features/admin/organizations/types/response.dto"
import { idColumn } from "../../../../components/Table/columns/idColumn"
import { displayColumn } from "../../../../components/Table/columns/displayColumn"

const columnHelper = createColumnHelper<OrganizationShortResponse>()

export const adminOrganizationsColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    ...idColumn(),
  }),

  columnHelper.accessor("countryName", {
    header: "Країна",
    size: 110,
    ...displayColumn(),
  }),

  columnHelper.accessor("legalName", {
    header: "Назва",
    size: 105,
    ...displayColumn(),
  }),

  columnHelper.accessor("registrationNumber", {
    header: "Реєстраційний номер",
    size: 225,
    ...displayColumn(),
  }),

  columnHelper.accessor("taxId", {
    header: "Налоговий номер",
    size: 200,
    ...displayColumn(),
  }),
]
