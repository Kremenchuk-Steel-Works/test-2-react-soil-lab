import { lazy } from 'react'
import { CirclePlus, Database, Frame, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const MoldingFlaskFrameLayout = lazy(() => import('@/pages/molding-shop/molding-flask/Layout'))
const MoldingFlaskFrameList = lazy(() => import('@/pages/molding-shop/molding-flask/list/List'))
const MoldingFlaskFrameAdd = lazy(() => import('@/pages/molding-shop/molding-flask/Add'))
const MoldingFlaskFrameDetails = lazy(() => import('@/pages/molding-shop/molding-flask/Details'))
const MoldingFlaskFrameUpdate = lazy(() => import('@/pages/molding-shop/molding-flask/Update'))

export const moldingFlaskFrameRoutes: AppRoute = {
  key: 'MoldingFlaskFrame',
  path: 'molding-flask',
  label: 'Опока',
  icon: Frame,
  Component: MoldingFlaskFrameLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoldingFlaskFrameList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoldingFlaskFrameList,
    },
    {
      key: 'MoldingFlaskFrameAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoldingFlaskFrameAdd,
    },
    {
      key: 'MoldingFlaskFrameDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoldingFlaskFrameDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'MoldingFlaskFrameUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: MoldingFlaskFrameUpdate,
    },
  ],
}
