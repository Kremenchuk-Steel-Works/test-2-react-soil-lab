import { lazy } from 'react'
import { CirclePlus, Database, Info, RefreshCcw, Users } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'

const AdminPeopleLayout = lazy(() => import('@/pages/admin-panel/people/Layout'))
const AdminPeopleList = lazy(() => import('@/pages/admin-panel/people/list/List'))
const AdminPeopleAdd = lazy(() => import('@/pages/admin-panel/people/Add'))
const AdminPeopleDetails = lazy(() => import('@/pages/admin-panel/people/Details'))
const AdminPeopleUpdate = lazy(() => import('@/pages/admin-panel/people/Update'))

export const peopleRoutes: AppRoute = {
  key: 'adminPeople',
  path: 'people',
  label: 'Люди',
  icon: Users,
  Component: AdminPeopleLayout,
  meta: {
    showAddButton: true,
  },
  children: [
    {
      key: 'adminPeopleList',
      path: '',
      label: 'Список',
      icon: Database,
      Component: AdminPeopleList,
    },
    {
      key: 'adminPeopleAdd',
      path: 'add',
      label: 'Додати',
      icon: CirclePlus,
      Component: AdminPeopleAdd,
    },
    {
      key: 'adminPeopleDetail',
      path: ':id',
      label: 'Деталі',
      icon: Info,
      Component: AdminPeopleDetails,
      meta: {
        showEditButton: true,
      },
    },
    {
      key: 'adminPeopleUpdate',
      path: ':id/update',
      label: 'Оновити',
      icon: RefreshCcw,
      Component: AdminPeopleUpdate,
    },
  ],
}
