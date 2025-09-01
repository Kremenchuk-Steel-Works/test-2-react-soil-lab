import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/context'
import { findRouteObjectByPath } from '@/app/routes/utils'
import { checkAccessLogic, useUserPermissionsSet } from '@/shared/hooks/usePermissions'
import { prepareButtonLogic, type PreparedButtonProps } from '@/utils/prepareButtonLogic'

export function usePageHeaderButtons(): PreparedButtonProps[] {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { currentUser } = useAuth()
  const userPermissions = useUserPermissionsSet()

  const currentRoute = useMemo(() => findRouteObjectByPath(pathname), [pathname])

  return useMemo(() => {
    const buttonConfigs = currentRoute?.meta?.buttons ?? []

    return buttonConfigs
      .map((buttonType) => {
        const targetPath = `${pathname}/${buttonType}`
        const hasAccess = checkAccessLogic(targetPath, currentUser, userPermissions)

        const onClick = () => void navigate(targetPath)

        return prepareButtonLogic(buttonType, hasAccess, onClick)
      })
      .filter((button): button is PreparedButtonProps => button !== null)
  }, [currentRoute, pathname, currentUser, userPermissions, navigate])
}
