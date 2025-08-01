import { lazy } from 'react'
import { Beaker, CirclePlus, Database, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const TriethylamineLayout = lazy(() => import('@/pages/molding-shop/triethylamine/Layout'))
const TriethylamineList = lazy(() => import('@/pages/molding-shop/triethylamine/list/List'))
const TriethylamineAdd = lazy(() => import('@/pages/molding-shop/triethylamine/Add'))
const TriethylamineDetails = lazy(() => import('@/pages/molding-shop/triethylamine/Details'))
const TriethylamineUpdate = lazy(() => import('@/pages/molding-shop/triethylamine/Update'))

export const triethylamineRoutes: AppRoute = {
  key: 'Triethylamine',
  path: 'triethylamine',
  label: 'Триетиламін',
  icon: Beaker,
  Component: TriethylamineLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'TriethylamineList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: TriethylamineList,
    },
    {
      key: 'TriethylamineAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: TriethylamineAdd,
    },
    {
      key: 'TriethylamineDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: TriethylamineDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'TriethylamineUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: TriethylamineUpdate,
    },
  ],
}
