import { lazy } from 'react'
import { CirclePlus, Database, Info, Layers, RefreshCcw } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const AdminDepartmentsLayout = lazy(() => import('@/pages/admin-panel/departments/Layout'))
const AdminDepartmentsList = lazy(() => import('@/pages/admin-panel/departments/list/List'))
const AdminDepartmentsAdd = lazy(() => import('@/pages/admin-panel/departments/Add'))
const AdminDepartmentsDetails = lazy(() => import('@/pages/admin-panel/departments/Details'))
const AdminDepartmentsUpdate = lazy(() => import('@/pages/admin-panel/departments/Update'))

export const departmentsRoutes: AppRoute = {
  key: 'adminDepartments',
  path: 'departments',
  label: 'Відділи',
  icon: Layers,
  Component: AdminDepartmentsLayout,
  children: [
    {
      key: 'adminDepartmentsList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminDepartmentsList,
    },
    {
      key: 'adminDepartmentsAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminDepartmentsAdd,
    },
    {
      key: 'adminDepartmentsDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminDepartmentsDetails,
    },
    {
      key: 'adminDepartmentsUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminDepartmentsUpdate,
    },
  ],
}
