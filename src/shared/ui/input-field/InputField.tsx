import React, { forwardRef, useId, useState } from 'react'
import { Calendar, Eye, EyeOff } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'

export type InputFieldProps = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

// Определяем разрешённые символы по кастомным типам
const allowedInputMap: Record<string, RegExp> = {
  strDate: /^[0-9.]$/,
}

// Универсальный фильтр для onBeforeInput
const filterInput = (type: string | undefined, e: React.FormEvent<HTMLInputElement>) => {
  const inputEvent = e as unknown as InputEvent
  const regex = type && allowedInputMap[type]
  if (regex && inputEvent.data && !regex.test(inputEvent.data)) {
    e.preventDefault()
  }
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type, id, ...props }, ref) => {
    const isPassword = type === 'password'
    const [visibleText, setVisibleText] = useState(false)

    // Генерируем уникальный ID с помощью хука useId
    const generatedId = useId()
    // Используем переданный id, если он есть, иначе — сгенерированный
    const finalId = id || generatedId

    const currentType = isPassword ? (visibleText ? 'text' : 'password') : type
    const toggleVisibility = () => setVisibleText((v) => !v)

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={finalId}
          type={currentType}
          onWheel={(e) => e.currentTarget.blur()}
          onBeforeInput={(e) => filterInput(type, e)}
          {...props}
          className={`peer w-full rounded-md border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 ${type === 'date' ? 'pr-10' : ''} `}
          placeholder=" "
        />
        <label
          htmlFor={finalId}
          className={`pointer-events-none absolute top-1 left-4 inline-block w-full truncate pr-5 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 dark:text-gray-400`}
        >
          {label}
        </label>
        {type === 'date' && (
          <button
            type="button"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-blue-500 focus:outline-none dark:text-gray-400"
          >
            <Calendar size={20} />
          </button>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer text-gray-500 hover:text-blue-500 focus:outline-none dark:text-gray-400"
          >
            {visibleText ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    )
  },
)

export default InputField
