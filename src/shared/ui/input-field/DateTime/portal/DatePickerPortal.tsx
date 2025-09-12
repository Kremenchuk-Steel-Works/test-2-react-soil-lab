import type { ReactNode } from 'react'
import { Portal } from '@/shared/ui/portal/Portal'

export const DatePickerPortal = ({ children }: { children?: ReactNode }) => {
  if (!children) {
    return null
  }

  return <Portal>{children}</Portal>
}
