import { createColumnHelper } from '@tanstack/react-table'
import type { LibraryListItemResponse } from '@/entities/library/types/response.dto'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<LibraryListItemResponse>()

export const libraryColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('shortName', {
    header: 'Коротка назва',
    size: 145,
    ...displayColumn(),
  }),
]
