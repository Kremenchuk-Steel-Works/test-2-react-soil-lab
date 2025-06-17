import { createColumnHelper } from "@tanstack/react-table"
import type { DepartmentShortResponse } from "../../../../features/admin/departments/types/response.dto"
import { idColumn } from "../../../../components/Table/columns/idColumn"
import { displayColumn } from "../../../../components/Table/columns/displayColumn"

const columnHelper = createColumnHelper<DepartmentShortResponse>()

export const adminDepartmentsColumns = [
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
