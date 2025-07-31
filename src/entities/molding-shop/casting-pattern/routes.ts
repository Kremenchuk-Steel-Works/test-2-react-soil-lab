import { lazy } from 'react'
import { CirclePlus, Cuboid, Database, Info, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const CastingPatternLayout = lazy(() => import('@/pages/molding-shop/casting-pattern/Layout'))
const CastingPatternList = lazy(() => import('@/pages/molding-shop/casting-pattern/list/List'))
const CastingPatternAdd = lazy(() => import('@/pages/molding-shop/casting-pattern/Add'))
const CastingPatternDetails = lazy(() => import('@/pages/molding-shop/casting-pattern/Details'))
const CastingPatternUpdate = lazy(() => import('@/pages/molding-shop/casting-pattern/Update'))

export const castingPatternRoutes: AppRoute = {
  key: 'CastingPattern',
  path: 'casting-pattern',
  label: 'Модель',
  icon: Cuboid,
  Component: CastingPatternLayout,
  meta: {
    buttons: ['add'],
  },
  children: [
    {
      key: 'CastingPatternList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: CastingPatternList,
    },
    {
      key: 'CastingPatternAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: CastingPatternAdd,
    },
    {
      key: 'CastingPatternDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: CastingPatternDetails,
      meta: {
        buttons: ['update'],
      },
    },
    {
      key: 'CastingPatternUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: CastingPatternUpdate,
    },
  ],
}
