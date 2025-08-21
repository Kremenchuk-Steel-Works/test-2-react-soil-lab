import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/context'
import { PATHS } from '@/app/routes/paths'
import LoadingPage from '@/pages/system/LoadingPage'
import NotAccessPage from '@/pages/system/NotAccessPage'
import { useHasAccessToCurrentRoute } from '@/shared/hooks/usePermissions'

type ProtectedRouteProps = PropsWithChildren & {
  allowedPermissions?: string[]
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth()
  const hasAccess = useHasAccessToCurrentRoute()

  if (currentUser === undefined) {
    return <LoadingPage />
  }

  if (currentUser === null) {
    return <Navigate to={PATHS.LOGIN} replace />
  }

  if (!hasAccess) {
    return <NotAccessPage />
  }

  return children
}
