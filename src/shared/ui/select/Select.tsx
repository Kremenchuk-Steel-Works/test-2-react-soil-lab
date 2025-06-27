import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export type SelectOption = {
  value: string | number | boolean | undefined
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string | number | boolean | undefined
  onChange?: (value: string | number | boolean | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  heightClass?: string
  isClearable?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled,
  heightClass = 'py-2',
  isClearable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onChange?.(undefined)
    setIsOpen(false)
  }

  const handleSelect = (opt: SelectOption) => {
    if (!opt.disabled) {
      onChange?.(opt.value)
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={twMerge(
        'relative inline-block text-left',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <div
        className={twMerge(
          'flex w-full items-center justify-between rounded-md border px-4',
          heightClass,
          'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
          'focus:ring-2 focus:ring-blue-500 focus:outline-none',
          disabled && 'cursor-not-allowed',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
        onClick={toggleOpen}
      >
        {/* Левая часть (label) */}
        <span className={twMerge(value !== undefined && value !== null ? '' : 'text-gray-400')}>
          {selectedLabel}
        </span>

        {/* Правая часть: кнопка очистки и стрелка */}
        <div className="flex items-center space-x-1">
          {/* Кнопка очистки */}
          {isClearable && value !== undefined && value !== null && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-1 text-gray-500 transition-colors hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
          <span className="mx-1 h-5 border-l border-gray-300 dark:border-gray-600" />
          {/* Стрелка */}
          <ChevronUp
            size={20}
            className={twMerge(
              'transform transition-transform duration-200 ease-in-out',
              'text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300',
              isOpen ? 'rotate-0' : 'rotate-180',
            )}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none dark:border-gray-600 dark:bg-gray-700"
          >
            {options.map((opt) => (
              <li
                key={String(opt.value)}
                onClick={() => handleSelect(opt)}
                className={twMerge(
                  'cursor-pointer px-4 py-2',
                  opt.disabled
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-600',
                  opt.value === value && 'bg-blue-100 dark:bg-blue-800',
                )}
                aria-disabled={opt.disabled}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Select
