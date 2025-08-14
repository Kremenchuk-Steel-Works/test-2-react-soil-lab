import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/model'
import type { PageButtonType } from '@/app/routes/types'
import { checkAccessLogic, useUserPermissionsSet } from '@/shared/hooks/usePermissions'
import Button, { type ButtonProps } from '@/shared/ui/button/Button'
import { prepareButtonLogic, type PreparedButtonProps } from '@/utils/prepareButtonLogic'

type ConfiguredButtonProps = {
  btnType: PageButtonType
  /** Куда навигировать. По умолчанию `${pathname}/${btnType}` */
  to?: string | ((pathname: string) => string)
  onClick?: () => void
  /** Путь, по которому проверять доступ (если отличается от to) */
  permissionPathOverride?: string
} & Omit<ButtonProps, 'onClick'>

// гарантируем, что сегмент не продублируется id/delete/delete -> id/delete
function joinPathWithAction(pathname: string, action: string) {
  const base = pathname.replace(/\/+$/, '')
  const suffix = `/${action}`
  return base.endsWith(suffix) ? base : `${base}${suffix}`
}

export function ConfiguredButton({
  btnType,
  to,
  onClick,
  permissionPathOverride,
  className,
  disabled,
  ...rest
}: ConfiguredButtonProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { currentUser } = useAuth()
  const userPermissions = useUserPermissionsSet()

  const targetPath = useMemo(() => {
    if (typeof to === 'function') return to(pathname)
    if (typeof to === 'string') return to
    return joinPathWithAction(pathname, btnType)
  }, [to, pathname, btnType])

  const hasAccess = useMemo(
    () => checkAccessLogic(permissionPathOverride ?? targetPath, currentUser, userPermissions),
    [permissionPathOverride, targetPath, currentUser, userPermissions],
  )

  console.warn('targetPath', targetPath)
  console.warn('hasAccess', hasAccess)

  const prepared = useMemo<PreparedButtonProps | null>(() => {
    const clickHandler = onClick ?? (() => navigate(targetPath))
    return prepareButtonLogic(btnType, hasAccess, clickHandler)
  }, [btnType, hasAccess, onClick, navigate, targetPath])

  if (!prepared) return null

  const { Icon, label, className: defClass, key: _ignoreKey, ...defButtonProps } = prepared

  return (
    <Button
      {...defButtonProps}
      {...rest}
      className={[defClass, className].filter(Boolean).join(' ')}
      disabled={disabled ?? defButtonProps.disabled}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden md:inline">{label}</span>
    </Button>
  )
}
