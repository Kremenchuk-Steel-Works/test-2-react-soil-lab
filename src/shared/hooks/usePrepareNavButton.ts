import { useCallback } from 'react'
import { useNavigate, useResolvedPath } from 'react-router-dom'
import type { PageButtonType } from '@/app/routes/types'
import { useCanAccessPath } from '@/shared/hooks/usePermissions'
import { prepareButtonLogic, type PreparedButtonProps } from '@/utils/prepareButtonLogic'

/**
 * Хук для подготовки стандартной кнопки, выполняющей навигацию.
 * Инкапсулирует логику проверки прав и создания обработчика.
 * @param type - Тип кнопки ('add', 'update' и т.д.).
 * @param pathSuffix - Необязательный суффикс пути. По умолчанию используется `type`.
 * @returns Пропсы для кнопки или `null`, если нет доступа.
 */
export function usePrepareNavButton(
  type: PageButtonType,
  pathSuffix?: string,
): PreparedButtonProps | null {
  const navigate = useNavigate()

  // Если суффикс пути не указан, используем тип кнопки по умолчанию
  const targetPathSuffix = pathSuffix ?? type

  // Получаем полный путь и проверяем доступ к нему
  const resolvedPath = useResolvedPath(targetPathSuffix)
  const hasAccess = useCanAccessPath(resolvedPath.pathname)

  // Создаем обработчик клика с помощью useCallback для стабильности
  const handleClick = useCallback(() => {
    navigate(targetPathSuffix)
  }, [navigate, targetPathSuffix])

  // Используем нашу чистую логику для финальной подготовки
  return prepareButtonLogic(type, hasAccess, handleClick)
}
