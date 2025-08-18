import { lazy } from 'react'
import { Factory, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import { moldPassportRoutes } from '@/entities/soil-lab/mold-passport'

const SoilLabLayout = lazy(() => import('@/pages/soil-lab/Layout'))
const SoilLabMain = lazy(() => import('@/pages/soil-lab/Main'))

export const soilLabRoutes: AppRoute = {
  key: 'soilLab',
  path: '/soil-lab',
  label: 'Лабораторія сумішей',
  icon: Factory,
  Component: SoilLabLayout,
  requiredPermissions: ['admin'],
  children: [
    {
      key: 'moldingShopIndex',
      path: '',
      label: '',
      icon: Users,
      Component: SoilLabMain,
      inSidebar: false,
    },
    moldPassportRoutes,
  ],
}
