import { lazy } from 'react'
import { CirclePlus, Database, Globe, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/routes'
import AdminCountryLayout from '@/pages/admin-panel/country/Layout'

const AdminCountryList = lazy(() => import('../../../pages/admin-panel/country/list/List'))
const AdminCountryAdd = lazy(() => import('../../../pages/admin-panel/country/Add'))
const AdminCountryDetails = lazy(() => import('../../../pages/admin-panel/country/Details'))
const AdminCountryUpdate = lazy(() => import('../../../pages/admin-panel/country/Update'))

export const countryRoutes: AppRoute = {
  key: 'adminCountry',
  path: 'country',
  label: 'Країни',
  icon: Globe,
  Component: AdminCountryLayout,
  children: [
    {
      key: 'adminCountryList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminCountryList,
    },
    {
      key: 'adminCountryAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminCountryAdd,
    },
    {
      key: 'adminCountryDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminCountryDetails,
    },
    {
      key: 'adminCountryUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminCountryUpdate,
    },
  ],
}
