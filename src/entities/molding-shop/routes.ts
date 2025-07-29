import { lazy } from 'react'
import { Factory, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import { moldPassportRoutes } from '@/entities/molding-shop/mold-passport/routes'

const MoldingShopLayout = lazy(() => import('@/pages/molding-shop/Layout'))
const MoldingShopMain = lazy(() => import('@/pages/molding-shop/Main'))

export const moldingShopRoutes: AppRoute = {
  key: 'moldingShop',
  path: '/molding-shop',
  label: 'Формувальний цех',
  icon: Factory,
  Component: MoldingShopLayout,
  requiredPermissions: ['admin'],
  children: [
    {
      key: 'moldingShopIndex',
      path: '',
      label: '',
      icon: Users,
      Component: MoldingShopMain,
      inSidebar: false,
    },
    moldPassportRoutes,
  ],
}
