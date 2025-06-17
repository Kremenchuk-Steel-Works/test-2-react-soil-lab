import { createColumnHelper } from "@tanstack/react-table"
import type { CityShortResponse } from "../../../../features/admin/city/types/response.dto"
import { idColumn } from "../../../../components/Table/columns/idColumn"
import { displayColumn } from "../../../../components/Table/columns/displayColumn"

const columnHelper = createColumnHelper<CityShortResponse>()

export const adminCityColumns = [
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
]
