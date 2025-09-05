import { createColumnHelper } from '@tanstack/react-table'
import type { OrganizationListResponse } from '@/entities/admin-old/organizations/types/response.dto'
import type { ListDataType } from '@/types/pagination'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { linkColumn } from '@/widgets/data-table/columns/linkColumn'

const columnHelper = createColumnHelper<ListDataType<OrganizationListResponse>>()

export const adminOrganizationsColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...linkColumn(),
  }),

  columnHelper.accessor('countryName', {
    header: 'Країна',
    size: 110,
    ...displayColumn(),
  }),

  columnHelper.accessor('legalName', {
    header: 'Назва',
    size: 105,
    ...displayColumn(),
  }),

  columnHelper.accessor('registrationNumber', {
    header: 'Реєстраційний номер',
    size: 225,
    ...displayColumn(),
  }),

  columnHelper.accessor('taxId', {
    header: 'Налоговий номер',
    size: 200,
    ...displayColumn(),
  }),
]
