// import { lazy } from 'react'
// import { Book, CirclePlus, Database, Info, RefreshCcw } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'
// import LibraryLayout from '@/pages/library/Layout'

// const LibraryList = lazy(() => import('@/pages/library/list/List'))
// const LibraryAdd = lazy(() => import('@/pages/library/Add'))
// const LibraryDetails = lazy(() => import('@/pages/library/Details'))
// const LibraryUpdate = lazy(() => import('@/pages/library/Update'))

// export const libraryRoutes: AppRoute = {
//   key: 'library',
//   path: '/library',
//   label: 'Бібліотека',
//   icon: Book,
//   Component: LibraryLayout,
//   requiredPermissions: ['library:view'],
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'libraryList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: LibraryList,
//       inSidebar: false,
//     },
//     {
//       key: 'libraryAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: LibraryAdd,
//       inSidebar: false,
//       requiredPermissions: ['library:edit'],
//     },
//     {
//       key: 'libraryDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: LibraryDetails,
//       inSidebar: false,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'libraryUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: LibraryUpdate,
//       inSidebar: false,
//       requiredPermissions: ['library:edit'],
//     },
//   ],
// }
