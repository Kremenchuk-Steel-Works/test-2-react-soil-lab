import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const moldExperimentColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: 'Документ',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Опис робіт',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Нотатки',
    size: 100,
    ...optionColumn(genderOptions),
  }),
]
