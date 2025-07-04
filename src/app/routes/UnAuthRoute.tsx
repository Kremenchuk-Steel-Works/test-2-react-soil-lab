import type { PropsWithChildren, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/model'
import { PATHS } from '@/app/routes/paths'
import { logger } from '@/shared/lib/logger'

type UnAuthRouteProps = PropsWithChildren & {
  children: ReactNode
}

export const UnAuthRoute = ({ children }: UnAuthRouteProps) => {
  const { currentUser } = useAuth()
  // Если пользователь залогинен, возвращаем на главную
  if (currentUser !== null && currentUser !== undefined) {
    logger.debug('Пользователь авторизован, переходим на главную')
    return <Navigate to={PATHS.MAIN} replace />
  }
  return <>{children}</>
}
