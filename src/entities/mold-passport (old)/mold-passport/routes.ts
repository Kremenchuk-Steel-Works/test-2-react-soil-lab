// import { lazy } from 'react'
// import { CirclePlus, Database, File, Info, RefreshCcw } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const MoldPassportLayout = lazy(() => import('@/pages/mold-passport (old)/mold-passport/Layout'))
// const MoldPassportList = lazy(() => import('@/pages/mold-passport (old)/mold-passport/list/List'))
// const MoldPassportAdd = lazy(() => import('@/pages/mold-passport (old)/mold-passport/Add'))
// const MoldPassportDetails = lazy(() => import('@/pages/mold-passport (old)/mold-passport/Details'))
// const MoldPassportUpdate = lazy(() => import('@/pages/mold-passport (old)/mold-passport/Update'))

// export const moldPassportRoutes: AppRoute = {
//   key: 'MoldPassport',
//   path: 'mold-passport',
//   label: 'Паспорт ливарної форми',
//   icon: File,
//   Component: MoldPassportLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'MoldPassportList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: MoldPassportList,
//     },
//     {
//       key: 'MoldPassportAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: MoldPassportAdd,
//     },
//     {
//       key: 'MoldPassportDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: MoldPassportDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'MoldPassportUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: MoldPassportUpdate,
//     },
//   ],
// }
