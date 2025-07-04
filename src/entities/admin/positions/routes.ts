import { lazy } from 'react'
import { BriefcaseBusiness, CirclePlus, Database, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/routes'

const AdminPositionsLayout = lazy(() => import('@/pages/admin-panel/positions/Layout'))
const AdminPositionsList = lazy(() => import('@/pages/admin-panel/positions/list/List'))
const AdminPositionsAdd = lazy(() => import('@/pages/admin-panel/positions/Add'))
const AdminPositionsDetails = lazy(() => import('@/pages/admin-panel/positions/Details'))
const AdminPositionsUpdate = lazy(() => import('@/pages/admin-panel/positions/Update'))

export const positionsRoutes: AppRoute = {
  key: 'adminPositions',
  path: 'positions',
  label: 'Посади',
  icon: BriefcaseBusiness,
  Component: AdminPositionsLayout,
  children: [
    {
      key: 'adminPositionsList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminPositionsList,
    },
    {
      key: 'adminPositionsAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminPositionsAdd,
    },
    {
      key: 'adminPositionsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminPositionsDetails,
    },
    {
      key: 'adminPositionsUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminPositionsUpdate,
    },
  ],
}
