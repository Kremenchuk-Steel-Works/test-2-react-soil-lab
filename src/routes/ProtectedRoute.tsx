import type { PropsWithChildren } from "react"
import type { User } from "../types/User"
import { Navigate } from "react-router-dom"
import { PATHS } from "./AppRoutes"
import { useAuth } from "../components/AuthProvider/AuthContext"
import LoadingPage from "../pages/system/LoadingPage"
import NotAccessPage from "../pages/system/NotAccessPage"

type ProtectedRouteProps = PropsWithChildren & {
  allowedPermissions?: User["permissions"][number]["name"][]
}

export default function ProtectedRoute({
  allowedPermissions,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth()

  if (currentUser === undefined) {
    return <LoadingPage />
  }

  if (currentUser === null) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  if (
    allowedPermissions &&
    !currentUser.permissions.some((p) => allowedPermissions.includes(p.name))
  ) {
    return <NotAccessPage />
  }

  return children
}
