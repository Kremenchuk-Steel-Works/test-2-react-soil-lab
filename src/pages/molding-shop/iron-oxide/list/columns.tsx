import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListResponse } from '@/entities/admin/people/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<ListDataType<PersonListResponse>>()

export const ironOxideColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Торгова марка',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Назва',
    size: 100,
    ...optionColumn(genderOptions),
  }),
]
