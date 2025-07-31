import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const patternPlateFrameColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: 'Номер креслення',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Серійний номер',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Статус',
    size: 100,
    ...optionColumn(genderOptions),
  }),
]
