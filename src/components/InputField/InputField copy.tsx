import { Calendar } from "lucide-react"
import React, { forwardRef } from "react"
import "react-datepicker/dist/react-datepicker.css"

export type InputFieldProps = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

// Определяем разрешённые символы по кастомным типам
const allowedInputMap: Record<string, RegExp> = {
  strDate: /^[0-9.]$/,
}

// Универсальный фильтр для onBeforeInput
const filterInput = (
  type: string | undefined,
  e: React.FormEvent<HTMLInputElement>
) => {
  const inputEvent = e as unknown as InputEvent
  const regex = type && allowedInputMap[type]
  if (regex && inputEvent.data && !regex.test(inputEvent.data)) {
    e.preventDefault()
  }
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          onWheel={(e) => e.currentTarget.blur()}
          onBeforeInput={(e) => filterInput(type, e)}
          {...props}
          className={`
          peer
          w-full px-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-md
          bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${type === "date" ? "pr-10" : ""}
        `}
          placeholder=" "
        />
        <label
          className={`absolute left-4 top-1 text-gray-500 dark:text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none inline-block truncate w-full pr-5
        `}
        >
          {label}
        </label>
        {type === "date" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 focus:outline-none pointer-events-none"
          >
            <Calendar size={20} />
          </button>
        )}
      </div>
    )
  }
)

export default InputField
