import { createColumnHelper } from "@tanstack/react-table"
import type { CountryShortResponse } from "../../../../entities/admin/country/types/response.dto"
import { idColumn } from "../../../../widgets/DataTable/columns/idColumn"
import { displayColumn } from "../../../../widgets/DataTable/columns/displayColumn"

const columnHelper = createColumnHelper<CountryShortResponse>()

export const adminCountryColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    ...idColumn(),
  }),
  columnHelper.accessor("name", {
    header: "Назва",
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor("nameLocal", {
    header: "Локальна назва",
    size: 110,
    ...displayColumn(),
  }),
  columnHelper.accessor("code", {
    header: "Код-2",
    size: 100,
    ...displayColumn(),
  }),
]
