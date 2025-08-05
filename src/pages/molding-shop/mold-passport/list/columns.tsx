import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { MoldPassportListItemResponse } from '@/shared/api/mold-passport/model'
import {
  booleanColumn,
  displayColumn,
  idColumn,
  listColumn,
  optionColumn,
} from '@/widgets/data-table'

const columnHelper = createColumnHelper<MoldPassportListItemResponse>()

export const moldPassportColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('isComplete', {
    header: 'Заповнена?',
    size: 145,
    ...booleanColumn(),
  }),

  columnHelper.accessor('primaryCastingProductName', {
    header: 'primaryCastingProductName',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Стать',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('isUser', {
    header: 'Користувач?',
    size: 155,
    ...booleanColumn(),
  }),

  columnHelper.accessor('isEmployee', {
    header: 'Робітник?',
    size: 135,
    ...booleanColumn(),
  }),

  columnHelper.accessor('contactsCount', {
    header: 'К-сть контактів',
    size: 180,
    ...displayColumn(),
  }),

  columnHelper.accessor('addressesCount', {
    header: 'К-сть адрес',
    size: 150,
    ...displayColumn(),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Організація',
    size: 150,
    ...listColumn(),
  }),

  columnHelper.accessor('positionNames', {
    header: 'Посада',
    size: 115,
    ...listColumn(),
  }),
]
