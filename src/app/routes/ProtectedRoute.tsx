import type { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { PATHS } from "./AppRoutes"
import { useAuth } from "../providers/auth/model"
import LoadingPage from "../../pages/system/LoadingPage"
import NotAccessPage from "../../pages/system/NotAccessPage"
import { useUserPermissionsTo } from "../../shared/hooks/usePermissions"

type ProtectedRouteProps = PropsWithChildren & {
  allowedPermissions?: string[]
}

export default function ProtectedRoute({
  allowedPermissions,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const hasAccessTo = useUserPermissionsTo()

  if (currentUser === undefined) {
    return <LoadingPage />
  }

  if (currentUser === null) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  if (allowedPermissions && !hasAccessTo(location.pathname)) {
    return <NotAccessPage />
  }

  return children
}
