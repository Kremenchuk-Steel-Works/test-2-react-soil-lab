import { lazy } from 'react'
import { Beaker, CirclePlus, Database, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const ResinFrameLayout = lazy(() => import('@/pages/molding-shop/resin/Layout'))
const ResinFrameList = lazy(() => import('@/pages/molding-shop/resin/list/List'))
const ResinFrameAdd = lazy(() => import('@/pages/molding-shop/resin/Add'))
const ResinFrameDetails = lazy(() => import('@/pages/molding-shop/resin/Details'))
const ResinFrameUpdate = lazy(() => import('@/pages/molding-shop/resin/Update'))

export const resinFrameRoutes: AppRoute = {
  key: 'ResinFrame',
  path: 'resin',
  label: 'Смола',
  icon: Beaker,
  Component: ResinFrameLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'ResinFrameList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: ResinFrameList,
    },
    {
      key: 'ResinFrameAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: ResinFrameAdd,
    },
    {
      key: 'ResinFrameDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: ResinFrameDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'ResinFrameUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: ResinFrameUpdate,
    },
  ],
}
