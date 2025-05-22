import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { UnAuthRoute } from "./UnAuthRoute"

import LoginPage from "../pages/LoginPage"
import MainPage from "../pages/MainPage"
import { APP_ROUTES, type AppRoute } from "./routes"

export const PATHS = {
  LOGIN: "/login",
  MAIN: "/",
  SPECTRAL_ANALYSIS: "/spectral_analysis",
  STREAMLIT_QUALITY_DASH: "/quality_dash",
}

// Рекурсивная функция построения маршрутов
const mapRoutes = (routes: AppRoute[]): RouteObject[] => {
  return routes.map((route) => {
    const isIndex = route.path === ""

    const baseRoute = {
      element: (
        <ProtectedRoute allowedPermissions={route.requiredPermissions}>
          {route.component}
        </ProtectedRoute>
      ),
    }

    if (isIndex) {
      return {
        index: true,
        ...baseRoute,
      }
    }

    return {
      path: route.path,
      ...baseRoute,
      children: route.children ? mapRoutes(route.children) : undefined,
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
    path: "*",
    element: <Navigate to={PATHS.MAIN} replace />,
  },
])
