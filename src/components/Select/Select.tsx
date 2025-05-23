import React, { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { ChevronUp, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
  placeholder = "Select an option",
  className,
  disabled,
  heightClass = "py-2",
  isClearable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder

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
        "relative inline-block text-left",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div
        className={twMerge(
          "w-full flex items-center justify-between px-4 border rounded-md",
          heightClass,
          "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          disabled && "cursor-not-allowed",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        onClick={toggleOpen}
      >
        {/* Левая часть (label) */}
        <span
          className={twMerge(
            value !== undefined && value !== null ? "" : "text-gray-400"
          )}
        >
          {selectedLabel}
        </span>

        {/* Правая часть: кнопка очистки и стрелка */}
        <div className="flex items-center space-x-1">
          {/* Кнопка очистки */}
          {isClearable && value !== undefined && value !== null && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <span className="border-l border-gray-300 dark:border-gray-600 h-5 mx-1" />
          {/* Стрелка */}
          <ChevronUp
            size={20}
            className={twMerge(
              "transform transition-transform duration-300 ease-in-out",
              "text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
              isOpen ? "rotate-0" : "rotate-180"
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
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          >
            {options.map((opt) => (
              <li
                key={String(opt.value)}
                onClick={() => handleSelect(opt)}
                className={twMerge(
                  "cursor-pointer px-4 py-2",
                  opt.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600",
                  opt.value === value && "bg-blue-100 dark:bg-blue-800"
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
