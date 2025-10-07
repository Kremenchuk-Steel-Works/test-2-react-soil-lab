import { lazy } from 'react'
import { ClipboardCheck, Database, Info } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const TestsListPage = lazy(() => import('./ui/list/List'))
const TestsLayoutPage = lazy(() => import('@/pages/soil-lab/tests/ui/Layout'))
const TestsDetailsPage = lazy(() => import('@/pages/soil-lab/tests/ui/Details'))

export const coreMixturesCO2TestsRoutes: AppRoute = {
  key: 'coreMixturesCO2Tests',
  path: 'tests',
  label: 'Іспити',
  icon: ClipboardCheck,
  Component: TestsLayoutPage,
  requiredPermissions: [PERMISSIONS.TESTS_READ],
  children: [
    {
      key: '',
      path: '',
      label: '',
      icon: Database,
      Component: TestsListPage,
    },
    {
      key: 'coreMixturesCO2TestsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: TestsLayoutPage,
      requiredPermissions: [PERMISSIONS.TESTS_READ],
      meta: {
        actionPermissions: {
          delete: [PERMISSIONS.TESTS_DELETE],
        },
      },
      children: [
        {
          key: '',
          path: '',
          label: '',
          icon: Info,
          Component: TestsDetailsPage,
        },
      ],
    },
  ],
}
