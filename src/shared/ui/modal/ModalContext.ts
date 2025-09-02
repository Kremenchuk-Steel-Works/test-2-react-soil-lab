import { createContext } from 'react'
import type { ModalProps } from '@/shared/ui/modal/Modal'

export type ModalOptions = Omit<ModalProps, 'isOpen' | 'onClose'>

export interface ModalContextType {
  openModal: (props: ModalOptions) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextType | null>(null)
ModalContext.displayName = 'ModalContext'
