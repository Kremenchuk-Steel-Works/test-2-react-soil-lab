import React, { forwardRef, useId, useState } from 'react'
import { Calendar, Eye, EyeOff, Loader2 } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.css'

export type InputFieldProps = {
  label: string
  isLoading?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

// Определяем разрешённые символы по кастомным типам
const allowedInputMap: Record<string, RegExp> = {
  number: /^-?$|^-?\d+$/,
  float: /^-?$|^-?\d+(?:[.,]\d*)?$/,
}

// Универсальный фильтр для onBeforeInput
const filterInput = (type: string | undefined, e: React.FormEvent<HTMLInputElement>) => {
  const inputEvent = e as unknown as InputEvent
  const target = e.currentTarget

  // Собственная валидация для number/float
  if (type === 'number' || type === 'float') {
    // не мешаем удалениям/IME-композиции
    const it = (inputEvent as unknown as { inputType?: string }).inputType ?? ''
    if (it.startsWith('delete') || it === 'insertCompositionText') return

    const data = (inputEvent as unknown as { data?: string | null }).data ?? ''
    if (data === '') return // непечатные/IME кейсы — пропускаем

    // будущая строка с учётом каретки/выделения
    const from = target.selectionStart ?? target.value.length
    const to = target.selectionEnd ?? target.value.length
    const next = target.value.slice(0, from) + data + target.value.slice(to)

    const pattern = allowedInputMap[type]
    if (!pattern.test(next)) {
      e.preventDefault()
    }
    return
  }

  const regex = type && allowedInputMap[type]
  if (regex && inputEvent.data && !regex.test(inputEvent.data)) {
    e.preventDefault()
  }
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type, id, isLoading = false, disabled, ...props }, ref) => {
    const isPassword = type === 'password'
    const [visibleText, setVisibleText] = useState(false)

    const generatedId = useId()
    const finalId = id || generatedId

    const currentType = isPassword ? (visibleText ? 'text' : 'password') : type
    const toggleVisibility = () => setVisibleText((v) => !v)

    // Определяем, будет ли справа отображаться какая-либо иконка
    const showRightIcon = isLoading || isPassword || type === 'date'

    // Number и float рендерим в DOM как text, чтобы снести нативную валидацию
    const domType = type === 'number' || type === 'float' ? 'text' : currentType
    const domInputMode =
      type === 'float' ? 'decimal' : type === 'number' ? 'numeric' : props.inputMode

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={finalId}
          type={domType}
          inputMode={domInputMode}
          onWheel={(e) => e.currentTarget.blur()}
          onBeforeInput={(e) => filterInput(type, e)}
          disabled={disabled}
          {...props}
          // Добавляем отступ справа, если есть иконка
          className={`peer w-full rounded-xl border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 ${
            showRightIcon ? 'pr-11' : ''
          } ${disabled ? 'opacity-50' : ''}`}
          placeholder=" "
        />
        <label
          htmlFor={finalId}
          className="pointer-events-none absolute top-1 left-4 inline-block w-full truncate pr-5 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 dark:text-gray-400"
        >
          {label}
        </label>

        {/* Контейнер для иконок справа */}
        <div className={`absolute top-1/2 right-4 flex -translate-y-1/2 items-center`}>
          {/* Индикатор загрузки (высший приоритет) */}
          {isLoading && (
            <Loader2 size={20} className="animate-spin text-gray-500 dark:text-gray-400" />
          )}

          {/* Иконка календаря (отображается, только если нет загрузки) */}
          {!isLoading && type === 'date' && (
            <button
              type="button"
              className={`pointer-events-none text-gray-500 focus:outline-none dark:text-gray-400`}
            >
              <Calendar size={20} />
            </button>
          )}

          {/* Иконка пароля (отображается, только если нет загрузки) */}
          {!isLoading && isPassword && (
            <button
              type="button"
              onClick={toggleVisibility}
              className="cursor-pointer text-gray-500 hover:text-blue-500 focus:outline-none dark:text-gray-400"
            >
              {visibleText ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    )
  },
)

export default InputField
