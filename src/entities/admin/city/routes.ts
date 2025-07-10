import { lazy } from 'react'
import { CirclePlus, Database, Info, Languages, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const AdminCityLayout = lazy(() => import('@/pages/admin-panel/city/Layout'))
const AdminCityList = lazy(() => import('@/pages/admin-panel/city/list/List'))
const AdminCityAdd = lazy(() => import('@/pages/admin-panel/city/Add'))
const AdminCityDetails = lazy(() => import('@/pages/admin-panel/city/Details'))
const AdminCityUpdate = lazy(() => import('@/pages/admin-panel/city/Update'))

export const cityRoutes: AppRoute = {
  key: 'adminCity',
  path: 'city',
  label: 'Міста',
  icon: Languages,
  Component: AdminCityLayout,
  children: [
    {
      key: 'adminCityList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminCityList,
    },
    {
      key: 'adminCityAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminCityAdd,
    },
    {
      key: 'adminCityDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminCityDetails,
    },
    {
      key: 'adminCityUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminCityUpdate,
    },
  ],
}
