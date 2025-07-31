import { lazy } from 'react'
import { CirclePlus, Cog, Database, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const MoldCoreTypeLayout = lazy(() => import('@/pages/molding-shop/mold-core-type/Layout'))
const MoldCoreTypeList = lazy(() => import('@/pages/molding-shop/mold-core-type/list/List'))
const MoldCoreTypeAdd = lazy(() => import('@/pages/molding-shop/mold-core-type/Add'))
const MoldCoreTypeDetails = lazy(() => import('@/pages/molding-shop/mold-core-type/Details'))
const MoldCoreTypeUpdate = lazy(() => import('@/pages/molding-shop/mold-core-type/Update'))

export const moldCoreTypeRoutes: AppRoute = {
  key: 'MoldCoreType',
  path: 'mold-core-type',
  label: 'Тип стрижня',
  icon: Cog,
  Component: MoldCoreTypeLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoldCoreTypeList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoldCoreTypeList,
    },
    {
      key: 'MoldCoreTypeAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoldCoreTypeAdd,
    },
    {
      key: 'MoldCoreTypeDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoldCoreTypeDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'MoldCoreTypeUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: MoldCoreTypeUpdate,
    },
  ],
}
