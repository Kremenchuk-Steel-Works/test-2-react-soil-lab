import { createBrowserRouter, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import { UnAuthRoute } from "./UnAuthRoute"

import LoginPage from "../pages/LoginPage"
import MainPage from "../pages/MainPage"
import { APP_ROUTES } from "./routes"

export const PATHS = {
  LOGIN: "/login",
  MAIN: "/",
  SPECTRAL_ANALYSIS: "/spectral_analysis",
  STREAMLIT_QUALITY_DASH: "/quality_dash",
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
  ...APP_ROUTES.map((route) => ({
    path: route.path,
    element: (
      <ProtectedRoute allowedPermissions={route.requiredPermissions}>
        {route.component}
      </ProtectedRoute>
    ),
    children: route.children?.map((child) => ({
      index: child.path === "",
      path: child.path,
      element: (
        <ProtectedRoute allowedPermissions={child.requiredPermissions}>
          {child.component}
        </ProtectedRoute>
      ),
    })),
  })),
  {
    path: "*",
    element: <Navigate to={PATHS.MAIN} replace />,
  },
])
