import { createColumnHelper } from "@tanstack/react-table"
import type { PositionShortResponse } from "../../../../features/admin/positions/types/response.dto"
import { idColumn } from "../../../../components/Table/idColumn"
import { displayColumn } from "../../../../components/Table/displayColumn"

const columnHelper = createColumnHelper<PositionShortResponse>()

export const adminPositionsColumns = [
  columnHelper.accessor("id", {
    header: "ID",
    ...idColumn(),
  }),
  columnHelper.accessor("name", {
    header: "Назва",
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor("description", {
    header: "Опис",
    size: 100,
    ...displayColumn(),
  }),
]
