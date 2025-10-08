import { Pen, Plus, Trash, type LucideIcon } from 'lucide-react'
import { PageAction } from '@/app/routes/types'
import type { ButtonProps } from '@/shared/ui/button/Button'

export type ButtonDefinition = ButtonProps & {
  label: string
  Icon: LucideIcon
}

export const BUTTON_DEFINITIONS: Record<PageAction, ButtonDefinition> = {
  [PageAction.create]: {
    label: 'Додати',
    Icon: Plus,
    className: 'flex items-center justify-center gap-1 whitespace-nowrap',
  },
  [PageAction.update]: {
    label: 'Редагувати',
    Icon: Pen,
    className: 'flex items-center justify-center gap-1 whitespace-nowrap',
    customColor: 'orange',
  },
  [PageAction.delete]: {
    label: 'Видалити',
    Icon: Trash,
    className: 'flex items-center justify-center gap-1 whitespace-nowrap',
    customColor: 'red',
  },
}
