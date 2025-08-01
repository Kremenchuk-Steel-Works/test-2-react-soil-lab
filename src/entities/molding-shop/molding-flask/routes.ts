import { lazy } from 'react'
import { CirclePlus, Database, Frame, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const MoldingFlaskLayout = lazy(() => import('@/pages/molding-shop/molding-flask/Layout'))
const MoldingFlaskList = lazy(() => import('@/pages/molding-shop/molding-flask/list/List'))
const MoldingFlaskAdd = lazy(() => import('@/pages/molding-shop/molding-flask/Add'))
const MoldingFlaskDetails = lazy(() => import('@/pages/molding-shop/molding-flask/Details'))
const MoldingFlaskUpdate = lazy(() => import('@/pages/molding-shop/molding-flask/Update'))

export const moldingFlaskRoutes: AppRoute = {
  key: 'MoldingFlask',
  path: 'molding-flask',
  label: 'Опока',
  icon: Frame,
  Component: MoldingFlaskLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'MoldingFlaskList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: MoldingFlaskList,
    },
    {
      key: 'MoldingFlaskAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: MoldingFlaskAdd,
    },
    {
      key: 'MoldingFlaskDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: MoldingFlaskDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'MoldingFlaskUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: MoldingFlaskUpdate,
    },
  ],
}
