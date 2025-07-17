import { lazy } from 'react'
import { Factory, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import { moldPassportRoutes } from '@/entities/mold-passport/mold-passport/routes'

const MoldPassportMain = lazy(() => import('@/pages/mold-passport/Main'))
const MoldPassportMainLayout = lazy(() => import('@/pages/mold-passport/Layout'))

export const moldPassportMainRoutes: AppRoute = {
  key: 'mold',
  path: '/mold',
  label: 'Ливарний цех',
  icon: Factory,
  Component: MoldPassportMainLayout,
  requiredPermissions: ['admin'],
  children: [
    {
      key: 'moldPassportMain',
      path: '',
      label: '',
      icon: Users,
      Component: MoldPassportMain,
      inSidebar: false,
    },
    moldPassportRoutes,
  ],
}
