import React, { createContext, useContext, useState, type ReactNode } from 'react'
import Modal, { type ModalProps } from '@/shared/ui/modal/Modal'

interface ModalContextType {
  openModal: (props: Omit<ModalProps, 'isOpen' | 'onClose'>) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalProps, setModalProps] = useState<Omit<ModalProps, 'isOpen' | 'onClose'>>()
  const [isOpen, setIsOpen] = useState(false)

  const openModal = (props: Omit<ModalProps, 'isOpen' | 'onClose'>) => {
    setModalProps(props)
    setIsOpen(true)
  }

  const closeModal = () => {
    if (!modalProps?.blocking) {
      setIsOpen(false)
    }
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalProps && <Modal isOpen={isOpen} onClose={closeModal} {...modalProps} />}
    </ModalContext.Provider>
  )
}

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
