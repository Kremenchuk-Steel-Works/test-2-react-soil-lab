import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import ReactDOM from 'react-dom'
import { twMerge } from 'tailwind-merge'

export interface ModalProps {
  className?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode | (() => React.ReactNode)
  label?: React.ReactNode
  footer?: React.ReactNode
  blocking?: boolean
  animationDuration?: number
}

const Modal: React.FC<ModalProps> = ({
  className,
  isOpen,
  onClose,
  children,
  label = ' ',
  footer,
  blocking = false,
  animationDuration = 300,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isOpen) {
      setIsMounted(true)
    } else {
      timeoutId = setTimeout(() => {
        setIsMounted(false)
      }, animationDuration)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isOpen, animationDuration])

  // Управляет исключительно состоянием анимации.
  useEffect(() => {
    if (isMounted) {
      // Сразу после монтирования, мы меняем состояние для запуска анимации открытия.
      const frameId = requestAnimationFrame(() => {
        setIsTransitioning(true)
      })
      return () => cancelAnimationFrame(frameId)
    } else {
      // При размонтировании сбрасываем состояние анимации.
      setIsTransitioning(false)
    }
  }, [isMounted])

  const handleClose = useCallback(() => {
    if (!blocking) {
      onClose()
    }
  }, [blocking, onClose])

  // Если компонент не смонтирован, ничего не рендерим.
  if (!isMounted) {
    return null
  }

  // Рендерим портал
  return ReactDOM.createPortal(
    <div
      className={twMerge(
        'fixed inset-0 z-50 flex h-screen items-center justify-center transition-opacity',
        `duration-${animationDuration}`,
        isOpen && isTransitioning ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div className="absolute inset-0 bg-black/25" onClick={handleClose} />

      <div
        className={twMerge(
          'relative flex max-h-full w-4/5 max-w-2xl transform flex-col rounded-lg bg-gray-50 text-slate-700 shadow-lg transition-transform dark:bg-gray-800 dark:text-slate-300',
          `duration-${animationDuration}`,
          isOpen && isTransitioning ? 'scale-100' : 'scale-95', // scale-95 вместо scale-0 выглядит плавнее
          className,
        )}
      >
        <div className="overflow-y-auto">
          <div className="relative flex h-12 items-center justify-center px-10">
            {!blocking && (
              <button
                onClick={handleClose}
                className="absolute right-2.5 text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-white"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <div className="pointer-events-none absolute flex justify-center">{label}</div>
          </div>

          <div className="px-6 pb-6">{typeof children === 'function' ? children() : children}</div>

          {footer && <div className="p-2">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
