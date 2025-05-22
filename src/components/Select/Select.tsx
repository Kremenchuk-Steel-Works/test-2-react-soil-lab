import React, { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export type SelectOption = {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  heightClass?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled,
  heightClass = "py-2",
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
      {/* Кнопка селекта*/}
      <button
        type="button"
        className={twMerge(
          "w-full flex items-center justify-between px-4 border rounded-md cursor-pointer",
          heightClass,
          "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          disabled && "cursor-not-allowed"
        )}
        onClick={toggleOpen}
        disabled={disabled}
      >
        {/* Текст */}
        <span className={twMerge(value ? "" : "text-gray-400")}>
          {selectedLabel}
        </span>

        <div className="flex items-center">
          {/* Разделитель между текстом и иконкой */}
          <span className="border-l border-gray-300 dark:border-gray-600 h-5 mx-1"></span>
          {/* Иконка */}
          <ChevronUp
            size={20}
            className={twMerge(
              "transform transition-transform duration-300 ease-in-out",
              "text-gray-500 dark:text-gray-400",
              isOpen ? "rotate-0" : "rotate-180"
            )}
          />
        </div>
      </button>

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
                key={opt.value}
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
