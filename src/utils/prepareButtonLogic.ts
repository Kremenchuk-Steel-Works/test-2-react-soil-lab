import type { PageAction } from '@/app/routes/types'
import { logger } from '@/shared/lib/logger'
import { BUTTON_DEFINITIONS, type ButtonDefinition } from '@/widgets/page/button.config'

export type PreparedButtonProps = ButtonDefinition & {
  key: string
  onClick: () => void
}

// Чистая функция, которая не использует хуки
export function prepareButtonLogic(
  type: PageAction,
  hasAccess: boolean,
  onClick: () => void,
): PreparedButtonProps | null {
  if (!hasAccess) {
    return null
  }

  const definition = BUTTON_DEFINITIONS[type]
  if (!definition) {
    logger.warn(`No definition found for button type: ${type}`)
    return null
  }

  return {
    ...definition,
    key: type,
    onClick,
  }
}
