import type { PropsWithChildren, ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { PATHS } from "./AppRoutes"
import { useAuth } from "../providers/auth/model"
import { logger } from "../../shared/lib/logger"

type UnAuthRouteProps = PropsWithChildren & {
  children: ReactNode
}

export const UnAuthRoute = ({ children }: UnAuthRouteProps) => {
  const { currentUser } = useAuth()
  // Если пользователь залогинен, возвращаем обратно
  if (currentUser !== null && currentUser !== undefined) {
    logger.debug("Пользователь авторизован, переходим на главную")
    return <Navigate to={PATHS.MAIN} replace />
  }
  return <>{children}</>
}
