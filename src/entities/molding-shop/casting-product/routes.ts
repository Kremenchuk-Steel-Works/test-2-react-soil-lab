// import { lazy } from 'react'
// import { CirclePlus, Database, Info, RefreshCcw, SquareDashed } from 'lucide-react'
// import type { AppRoute } from '@/app/routes/types'

// const CastingProductLayout = lazy(() => import('@/pages/molding-shop/casting-product/Layout'))
// const CastingProductList = lazy(() => import('@/pages/molding-shop/casting-product/list/List'))
// const CastingProductAdd = lazy(() => import('@/pages/molding-shop/casting-product/Add'))
// const CastingProductDetails = lazy(() => import('@/pages/molding-shop/casting-product/Details'))
// const CastingProductUpdate = lazy(() => import('@/pages/molding-shop/casting-product/Update'))

// export const castingProductRoutes: AppRoute = {
//   key: 'CastingProduct',
//   path: 'casting-product',
//   label: 'Виливок',
//   icon: SquareDashed,
//   Component: CastingProductLayout,
//   meta: {
//     buttons: ['add'],
//   },
//   children: [
//     {
//       key: 'CastingProductList',
//       path: '',
//       label: 'Список',
//       icon: Database,
//       Component: CastingProductList,
//     },
//     {
//       key: 'CastingProductAdd',
//       path: 'add',
//       label: 'Додати',
//       icon: CirclePlus,
//       Component: CastingProductAdd,
//     },
//     {
//       key: 'CastingProductDetail',
//       path: ':id',
//       label: 'Деталі',
//       icon: Info,
//       Component: CastingProductDetails,
//       meta: {
//         buttons: ['update'],
//       },
//     },
//     {
//       key: 'CastingProductUpdate',
//       path: ':id/update',
//       label: 'Оновити',
//       icon: RefreshCcw,
//       Component: CastingProductUpdate,
//     },
//   ],
// }
