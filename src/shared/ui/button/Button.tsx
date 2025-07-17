import { twMerge } from 'tailwind-merge'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  customColor?: keyof typeof colorVariants
}

// Определяем варианты цветов в виде объекта
const colorVariants = {
  blue: [
    'bg-blue-600 text-white',
    'hover:bg-blue-500',

    'dark:bg-blue-600 dark:text-white',
    'dark:hover:bg-blue-700',
  ],
  red: [
    'bg-red-600 text-white',
    'hover:bg-red-500',

    'dark:bg-red-600 dark:text-white',
    'dark:hover:bg-red-700',
  ],
  green: [
    'bg-green-600 text-white',
    'hover:bg-green-500',

    'dark:bg-green-600 dark:text-white',
    'dark:hover:bg-green-700',
  ],
  orange: [
    'bg-orange-600 text-white',
    'hover:bg-orange-500',

    'dark:bg-orange-600 dark:text-white',
    'dark:hover:bg-orange-700',
  ],
  neutral: [
    'bg-slate-200 text-slate-900',
    'hover:bg-slate-300',

    'dark:bg-slate-700 dark:text-slate-200',
    'dark:hover:bg-slate-600',
  ],
}

const Button: React.FC<ButtonProps> = ({
  className,
  customColor = 'blue',
  children,
  type = 'button',
  ...rest
}) => {
  const baseStyles = `
    py-2 px-4
    text-white font-semibold rounded-md
    transition cursor-pointer active:scale-95
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  // Выбираем стили цвета из объекта
  const colorStyles = colorVariants[customColor]

  return (
    <button {...rest} type={type} className={twMerge(baseStyles, colorStyles, className)}>
      {children}
    </button>
  )
}

export default Button
