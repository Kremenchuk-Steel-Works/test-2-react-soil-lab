import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const moldCoreTypeColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: 'Модель виливка',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Номер моделі',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Номер інвентарного ящику',
    size: 100,
    ...displayColumn(),
  }),

  columnHelper.accessor('isUser', {
    header: 'Термін придатності, днів',
    size: 100,
    ...displayColumn(),
  }),
]
