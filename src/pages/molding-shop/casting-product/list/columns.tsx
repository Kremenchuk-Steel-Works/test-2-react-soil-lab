import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const castingProductColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: 'Тип',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Назва',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Номер креслення',
    size: 100,
    ...displayColumn(),
  }),

  columnHelper.accessor('isUser', {
    header: 'Тільки ручна формовка',
    size: 100,
    ...displayColumn(),
  }),
]
