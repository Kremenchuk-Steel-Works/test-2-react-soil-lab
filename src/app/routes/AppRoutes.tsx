import { Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { APP_ROUTES, type AppRoute } from '@/app/routes/paths'
import ProtectedRoute from '@/app/routes/ProtectedRoute'
import { UnAuthRoute } from '@/app/routes/UnAuthRoute'
import LoginPage from '@/pages/LoginPage'
import MainPage from '@/pages/MainPage'
import LoadingPage from '@/pages/system/LoadingPage'

export const PATHS = {
  LOGIN: '/login',
  MAIN: '/',
}

// Рекурсивная функция построения маршрутов
const mapRoutes = (routes: AppRoute[]): RouteObject[] => {
  return routes.map((route) => {
    const { Component, children, path, requiredPermissions } = route
    const isIndex = path === ''

    // Создаем элемент с Suspense
    const elementWithSuspense = (
      <ProtectedRoute allowedPermissions={requiredPermissions}>
        <Suspense fallback={<LoadingPage />}>
          <Component />
        </Suspense>
      </ProtectedRoute>
    )

    if (isIndex) {
      return {
        index: true,
        element: elementWithSuspense,
      }
    }

    return {
      path: path,
      element: elementWithSuspense,
      children: children ? mapRoutes(children) : undefined,
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
  {
    path: PATHS.MAIN,
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  ...mapRoutes(APP_ROUTES),
  {
    path: '*',
    element: <Navigate to={PATHS.MAIN} replace />,
  },
])
