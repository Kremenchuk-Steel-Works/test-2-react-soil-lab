import ReactDOM from "react-dom"
import { twMerge } from "tailwind-merge"

export interface BottomSheetProps {
  className?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  label?: React.ReactNode
  footer?: React.ReactNode
  blocking?: boolean
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  className,
  isOpen,
  onClose,
  children,
  label,
  footer,
}) => {
  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center h-screen transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Затемнённый фон */}
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      {/* Плашка */}
      <div
        className={twMerge(
          `flex flex-col relative w-6/7 max-h-full max-w-200 bg-gray-50 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-lg transform transition-transform duration-300 ${
            isOpen ? "scale-100" : "scale-0"
          }`,
          className
        )}
      >
        {label && (
          <div className="p-2 shrink-0 flex items-center justify-center">
            {label}
          </div>
        )}
        {/* Прокручиваемая область */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        {footer && <div className="p-2 shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default BottomSheet
