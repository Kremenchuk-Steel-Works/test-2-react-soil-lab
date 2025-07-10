import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

type InputFieldProps = {
  className?: string
  inputClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const InputFieldNoLabel: React.FC<InputFieldProps> = ({
  className,
  inputClassName = '',
  id,
  ...props
}) => {
  // Генерируем уникальный ID с помощью хука useId
  const generatedId = useId()
  // Используем переданный id, если он есть, иначе — сгенерированный
  const finalId = id || generatedId

  const baseStyles = `relative w-full`
  const inputBaseStyles = `peer w-full px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`
  return (
    <div className={twMerge(baseStyles, className)}>
      <input
        {...props}
        id={finalId}
        className={twMerge(inputBaseStyles, inputClassName)}
        placeholder=" "
      />
    </div>
  )
}

export default InputFieldNoLabel
