import { lazy } from 'react'
import { ClipboardCheck, Database, Info, Trash } from 'lucide-react'
import { PERMISSIONS } from '@/app/routes/permissions'
import type { AppRoute } from '@/app/routes/types'

const TestsLayout = lazy(() => import('@/pages/soil-lab/tests/ui/Layout'))
const TestsList = lazy(() => import('@/pages/soil-lab/tests/ui/list/List'))
const TestsDelete = lazy(() => import('@/pages/soil-lab/tests/ui/Delete'))
const TestsDetails = lazy(() => import('@/pages/soil-lab/tests/ui/Details'))

export const testsRoutes: AppRoute = {
  key: 'Tests',
  path: 'tests',
  label: 'Іспити',
  icon: ClipboardCheck,
  Component: TestsLayout,
  children: [
    {
      key: 'TestsList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: TestsList,
    },
    {
      key: 'TestsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: TestsLayout,
      requiredPermissions: [PERMISSIONS.TESTS_READ],
      children: [
        {
          key: 'TestsIndex',
          path: '',
          label: 'Деталі',
          icon: Info,
          Component: TestsDetails,
        },
        {
          key: 'TestsDelete',
          path: 'delete',
          label: 'Видалити',
          icon: Trash,
          Component: TestsDelete,
          requiredPermissions: [PERMISSIONS.TESTS_DELETE],
        },
      ],
    },
  ],
}
