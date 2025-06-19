import { twMerge } from "tailwind-merge"

export type InputFieldProps = {
  className?: string
  inputClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const InputFieldNoLabel: React.FC<InputFieldProps> = ({
  className,
  inputClassName = "",
  ...props
}) => {
  const baseStyles = `relative w-full`
  const inputBaseStyles = `peer w-full px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`
  return (
    <div className={twMerge(baseStyles, className)}>
      <input
        {...props}
        className={twMerge(inputBaseStyles, inputClassName)}
        placeholder=" "
      />
    </div>
  )
}

export default InputFieldNoLabel
