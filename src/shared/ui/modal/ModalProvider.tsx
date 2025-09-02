import { useCallback, useMemo, useRef, useState, type PropsWithChildren } from 'react'
import Modal from '@/shared/ui/modal/Modal'
import {
  ModalContext,
  type ModalContextType,
  type ModalOptions,
} from '@/shared/ui/modal/ModalContext'

export function ModalProvider({ children }: PropsWithChildren) {
  const [modalProps, setModalProps] = useState<ModalOptions | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Держим актуальные props в ref, чтобы closeModal не зависел от стейта
  const modalRef = useRef<ModalOptions | null>(null)

  const openModal = useCallback<ModalContextType['openModal']>((props) => {
    modalRef.current = props
    setModalProps(props)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    if (!modalRef.current?.blocking) {
      setIsOpen(false)
    }
  }, [])

  const value = useMemo<ModalContextType>(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  )

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalProps && <Modal isOpen={isOpen} onClose={closeModal} {...modalProps} />}
    </ModalContext.Provider>
  )
}
