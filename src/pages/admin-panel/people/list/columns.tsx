import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListItemResponse } from '@/entities/admin/people/types/response.dto'
import { booleanColumn } from '@/widgets/data-table/columns/booleanColumn'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'
import { listColumn } from '@/widgets/data-table/columns/listColumn'
import { optionColumn } from '@/widgets/data-table/columns/optionColumn'

const columnHelper = createColumnHelper<PersonListItemResponse>()

export const adminPeopleColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('fullName', {
    header: "Повне ім'я",
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Стать',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('photoUrl', {
    header: 'Фото',
    size: 100,
    cell: (info) => {
      const file = info.getValue()
      return file instanceof File ? (
        <img
          src={URL.createObjectURL(file)}
          alt="Photo"
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        '—'
      )
    },
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
