import { X } from "lucide-react"
import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { twMerge } from "tailwind-merge"

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
  label = " ",
  footer,
  blocking = false,
  animationDuration = 300,
}) => {
  const [shouldRender, setShouldRender] = useState(false)
  const [animateOpen, setAnimateOpen] = useState(false)

  useEffect(() => {
    let openTimeout: NodeJS.Timeout
    let closeTimeout: NodeJS.Timeout

    if (isOpen) {
      setShouldRender(true)
      // Даем фрейму примениться, потом включаем анимацию
      openTimeout = setTimeout(() => {
        setAnimateOpen(true)
      }, 10)
    } else {
      setAnimateOpen(false)
      closeTimeout = setTimeout(() => {
        setShouldRender(false)
      }, animationDuration)
    }

    return () => {
      clearTimeout(openTimeout)
      clearTimeout(closeTimeout)
    }
  }, [isOpen, animationDuration])

  const handleClose = () => {
    if (!blocking) {
      onClose()
    }
  }

  if (!shouldRender) return null

  return ReactDOM.createPortal(
    <div
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center h-screen transition-opacity duration-300",
        animateOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 bg-black/25" onClick={handleClose} />

      <div
        className={twMerge(
          "flex flex-col relative w-4/5 max-h-full max-w-2xl bg-gray-50 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-lg transform transition-transform duration-300",
          animateOpen ? "scale-100" : "scale-0",
          className
        )}
      >
        <div className="overflow-y-auto">
          <div className="relative h-12 flex items-center justify-center px-10">
            {!blocking && (
              <button
                onClick={handleClose}
                className="absolute right-2.5 text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-white"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="absolute flex justify-center pointer-events-none">
              {label}
            </div>
          </div>

          <div className="px-6 pb-6">
            {typeof children === "function" ? children() : children}
          </div>

          {footer && <div className="p-2">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
