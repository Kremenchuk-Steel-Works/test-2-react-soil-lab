import { createColumnHelper } from '@tanstack/react-table'
import { genderOptions } from '@/entities/admin/people/types/gender'
import type { PersonListResponse } from '@/entities/admin/people/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn, idColumn, optionColumn } from '@/widgets/data-table'

const columnHelper = createColumnHelper<ListDataType<PersonListResponse>>()

export const coreBatchColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('organizationNames', {
    header: 'Тип суміші',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('gender', {
    header: 'Тип стрижня',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Установка з виготовлення стрижнів',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Смола',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Триетиламін',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Оксид заліза',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Температура піску, °C',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Твердість контрольного стрижня, од.',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Дата та час виготовлення',
    size: 100,
    ...optionColumn(genderOptions),
  }),

  columnHelper.accessor('gender', {
    header: 'Термін придатності до',
    size: 100,
    ...optionColumn(genderOptions),
  }),
]
