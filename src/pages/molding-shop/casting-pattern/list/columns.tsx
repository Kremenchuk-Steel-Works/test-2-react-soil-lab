import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const castingPatternColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: 'Виливок',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Серійний номер',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Статус',
    size: 100,
    ...displayColumn(),
  }),
]
