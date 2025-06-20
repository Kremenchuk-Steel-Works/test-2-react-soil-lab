import { createColumnHelper } from "@tanstack/react-table"
import type { CityShortResponse } from '@/entities/admin/city/types/response.dto'
import { idColumn } from '@/widgets/data-table/columns/idColumn'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'

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
