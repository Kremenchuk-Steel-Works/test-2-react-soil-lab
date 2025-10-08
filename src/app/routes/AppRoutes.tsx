import { Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { PATHS } from '@/app/routes/paths'
import ProtectedRoute from '@/app/routes/ProtectedRoute'
import { APP_ROUTES } from '@/app/routes/routes'
import { type AppRoute } from '@/app/routes/types'
import { UnAuthRoute } from '@/app/routes/UnAuthRoute'
import { isIndexRoute } from '@/app/routes/utils/utils'
import LoginPage from '@/pages/LoginPage'
import LoadingPage from '@/pages/system/LoadingPage'

// Рекурсивная функция построения маршрутов
const mapRoutes = (routes: AppRoute[]): RouteObject[] => {
  return routes.map((route) => {
    const { Component, children, path } = route

    // Создаем элемент с Suspense
    const elementWithSuspense = (
      <ProtectedRoute>
        <Suspense fallback={<LoadingPage />}>
          <Component />
        </Suspense>
      </ProtectedRoute>
    )

    if (isIndexRoute(route)) {
      return {
        index: true,
        element: elementWithSuspense,
        handle: { route },
      }
    }

    return {
      path: path,
      element: elementWithSuspense,
      children: children ? mapRoutes(children) : undefined,
      handle: { route },
    }
  })
}

export const router = createBrowserRouter([
  {
    path: PATHS.LOGIN,
    element: (
      <UnAuthRoute>
        <LoginPage />
      </UnAuthRoute>
    ),
  },
  ...mapRoutes(APP_ROUTES),
  {
    path: '*',
    element: <Navigate to={PATHS.MAIN} replace />,
  },
])
