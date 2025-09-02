import { useContext } from 'react'
import { ModalContext, type ModalContextType } from '@/shared/ui/modal/ModalContext'

export const useModal = (): ModalContextType => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within a ModalProvider')
  return ctx
}
