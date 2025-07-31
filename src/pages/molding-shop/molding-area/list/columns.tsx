import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { booleanColumn, displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const moldingAreaColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: 'Назва',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Опис',
    size: 100,
    ...displayColumn(),
  }),
  columnHelper.accessor('isUser', {
    header: 'Одиниці тиску',
    size: 155,
    ...booleanColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Додаткові опції',
    size: 100,
    ...optionColumn(genderOptions),
  }),
]
