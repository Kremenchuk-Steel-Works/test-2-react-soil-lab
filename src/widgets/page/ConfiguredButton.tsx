import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Permission } from '@/app/routes/permissions'
import { segment, type PageAction } from '@/app/routes/types'
import Button, { type ButtonProps } from '@/shared/ui/button/Button'
import { CanAccess } from '@/shared/ui/permission/CanAccess'
import { prepareButtonLogic, type PreparedButtonProps } from '@/utils/prepareButtonLogic'

type ConfiguredButtonProps = {
  /** Тип кнопки, совпадает с action в meta.actionPermissions */
  btnType: PageAction
  /** Куда навигировать. По умолчанию `${pathname}/${btnType}` */
  to?: string | ((pathname: string) => string)
  /** Кастомный обработчик клика. Если не задан — навигация на `to` */
  onClick?: () => void
  /**
   * Явный список прав для проверки (OR-логика).
   * Если не указан — берём правило из meta.actionPermissions текущего роута
   * или fallback по targetPathForAction.
   */
  requiredPermissions?: Permission[] | Permission
  /**
   * Для действий, которые ведут на страницу (add/update), можно подсказать путь
   * целевого роута как fallback, если в meta нет actionPermissions.
   * Соответствует логике CanAccess/useCan.
   */
  targetPathForAction?: string
} & Omit<ButtonProps, 'onClick'>

// Гарантируем, что сегмент не продублируется: id/delete/delete -> id/delete
function joinPathWithAction(pathname: string, action: PageAction) {
  const base = pathname.replace(/\/+$/, '')
  const suffix = `/${segment(action)}`
  return base.endsWith(suffix) ? base : `${base}${suffix}`
}

/**
 * Кнопка, чья доступность определяется логикой CanAccess:
 * - либо по meta.actionPermissions[currentRoute][btnType]
 * - либо по явно переданным requiredPermissions
 * - при отсутствии правила в meta можно указать targetPathForAction (fallback).
 *
 * Кнопка отображается ТОЛЬКО если доступ разрешён.
 */
export function ConfiguredButton({
  btnType,
  to,
  onClick,
  requiredPermissions,
  targetPathForAction,
  className,
  disabled,
  ...rest
}: ConfiguredButtonProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const targetPath = useMemo(() => {
    if (typeof to === 'function') return to(pathname)
    if (typeof to === 'string') return to
    return joinPathWithAction(pathname, btnType)
  }, [to, pathname, btnType])

  const prepared = useMemo<PreparedButtonProps | null>(() => {
    const clickHandler = onClick ?? (() => navigate(targetPath))
    // Визуальные пропсы формируем сразу. Сам доступ контролируется CanAccess.
    return prepareButtonLogic(btnType, true, clickHandler)
  }, [btnType, onClick, navigate, targetPath])

  if (!prepared) return null

  const { Icon, label, className: defClass, key: _ignoreKey, ...defButtonProps } = prepared
  void _ignoreKey

  return (
    <CanAccess
      action={btnType}
      requiredPermissions={requiredPermissions}
      targetPathForAction={targetPathForAction}
    >
      <Button
        {...defButtonProps}
        {...rest}
        className={[defClass, className].filter(Boolean).join(' ')}
        disabled={disabled ?? defButtonProps.disabled}
      >
        <Icon className="h-5 w-5" />
        <span className="hidden md:inline">{label}</span>
      </Button>
    </CanAccess>
  )
}
