import { lazy } from 'react'
import { ClipboardCheck, Info } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import { PageAction, type AppRoute } from '@/app/routes/types'

const TestsListPage = lazy(() => import('./ui/list/List'))
const TestsLayoutPage = lazy(() => import('@/pages/soil-lab/tests/ui/Layout'))
const TestsDetailsPage = lazy(() => import('@/pages/soil-lab/tests/ui/Details'))

export const moldingMixturesTestsRoutes: AppRoute = {
  key: 'moldingMixturesTests',
  path: 'tests',
  label: 'Іспити',
  icon: ClipboardCheck,
  Component: TestsLayoutPage,
  requiredPermissions: [PERMISSIONS.TESTS_READ],
  children: [
    {
      index: true,
      Component: TestsListPage,
    },
    {
      key: 'moldingMixturesTestsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: TestsLayoutPage,
      requiredPermissions: [PERMISSIONS.TESTS_READ],
      meta: {
        actionPermissions: {
          [PageAction.delete]: [PERMISSIONS.TESTS_DELETE],
        },
      },
      children: [
        {
          index: true,
          Component: TestsDetailsPage,
        },
      ],
    },
  ],
}
