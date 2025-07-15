import { lazy } from 'react'
import { Shield, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import { moldPassportRoutes } from '@/entities/mold-passport/mold-passport/routes'

const MoldPassportMain = lazy(() => import('@/pages/mold-passport/Main'))
const MoldPassportMainLayout = lazy(() => import('@/pages/mold-passport/Layout'))

export const moldPassportMainRoutes: AppRoute = {
  key: 'mold',
  path: '/mold',
  label: 'Паспорт плавки',
  icon: Shield,
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
