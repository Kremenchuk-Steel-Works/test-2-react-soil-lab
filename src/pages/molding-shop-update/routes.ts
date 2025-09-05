import { lazy } from 'react'
import { Factory, Users } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'
import { moldPassportRoutes } from '@/pages/molding-shop-update/mold-passport/routes'

const moldingShopUpdateLayout = lazy(() => import('@/pages/molding-shop-update/Layout'))
const moldingShopUpdateMain = lazy(() => import('@/pages/molding-shop-update/Main'))

export const moldingShopUpdateRoutes: AppRoute = {
  key: 'moldingShopUpdate',
  path: '/molding-shop-update',
  label: 'Паспорт ливарної форми',
  icon: Factory,
  Component: moldingShopUpdateLayout,
  requiredPermissions: [PERMISSIONS.ADMIN],
  children: [
    {
      key: 'moldingShopIndex',
      path: '',
      label: '',
      icon: Users,
      Component: moldingShopUpdateMain,
      inSidebar: false,
    },
    moldPassportRoutes,
  ],
}
