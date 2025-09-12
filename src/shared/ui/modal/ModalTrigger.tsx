import { useCallback, useState } from 'react'
import Modal, { type ModalProps } from '@/shared/ui/modal/Modal'

interface ModalTriggerProps {
  trigger: (open: () => void) => React.ReactNode
  sheetProps?: Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>
  children: React.ReactNode | ((props: { onSuccess: () => void }) => React.ReactNode)
}

const ModalTrigger: React.FC<ModalTriggerProps> = ({ trigger, sheetProps, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const finalSheetProps: typeof sheetProps = {
    ...sheetProps,
    className: sheetProps?.className ?? 'w-[95%] sm:max-w-md',
  }

  const renderChildren = () =>
    typeof children === 'function' ? children({ onSuccess: close }) : children

  return (
    <>
      {trigger(open)}
      <Modal isOpen={isOpen} onClose={close} {...finalSheetProps}>
        {renderChildren()}
      </Modal>
    </>
  )
}

export default ModalTrigger
