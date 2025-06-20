import { createColumnHelper } from '@tanstack/react-table'
import type { OrganizationShortResponse } from '@/entities/admin/organizations/types/response.dto'
import { displayColumn } from '@/widgets/data-table/columns/displayColumn'
import { idColumn } from '@/widgets/data-table/columns/idColumn'

const columnHelper = createColumnHelper<OrganizationShortResponse>()

export const adminOrganizationsColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
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
