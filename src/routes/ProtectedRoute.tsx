import type { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { PATHS } from "./AppRoutes"
import { useAuth } from "../components/AuthProvider/AuthContext"
import LoadingPage from "../pages/system/LoadingPage"
import NotAccessPage from "../pages/system/NotAccessPage"
import { useUserPermissionsSet } from "../hooks/usePermissions"

type ProtectedRouteProps = PropsWithChildren & {
  allowedPermissions?: string[]
}

export default function ProtectedRoute({
  allowedPermissions,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const userPermissions = useUserPermissionsSet()

  if (currentUser === undefined) {
    return <LoadingPage />
  }

  if (currentUser === null) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  if (
    allowedPermissions &&
    !allowedPermissions.some((perm) => userPermissions.has(perm))
  ) {
    return <NotAccessPage />
  }

  return children
}
