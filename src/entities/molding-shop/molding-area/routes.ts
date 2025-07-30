import { lazy } from 'react'
import { CirclePlus, Database, Info, LayoutGrid, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const MoldingAreaLayout = lazy(() => import('@/pages/molding-shop/molding-area/Layout'))
const MoldingAreaList = lazy(() => import('@/pages/molding-shop/molding-area/list/List'))
const MoldingAreaAdd = lazy(() => import('@/pages/molding-shop/molding-area/Add'))
const MoldingAreaDetails = lazy(() => import('@/pages/molding-shop/molding-area/Details'))
const MoldingAreaUpdate = lazy(() => import('@/pages/molding-shop/molding-area/Update'))

export const MoldingAreaRoutes: AppRoute = {
  key: 'MoldingArea',
  path: 'molding-area',
  label: 'Ділянка формовки',
  icon: LayoutGrid,
  Component: MoldingAreaLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoldingAreaList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoldingAreaList,
    },
    {
      key: 'MoldingAreaAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoldingAreaAdd,
    },
    {
      key: 'MoldingAreaDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoldingAreaDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'MoldingAreaUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: MoldingAreaUpdate,
    },
  ],
}
