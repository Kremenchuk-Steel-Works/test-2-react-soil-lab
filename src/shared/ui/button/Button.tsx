import { twMerge } from 'tailwind-merge'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  customColor?: ButtonColors
}

const buttonColors = ['blue', 'red', 'orange', 'green'] as const

type ButtonColors = (typeof buttonColors)[number]

const getColorStyles = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700'
    case 'red':
      return 'bg-red-600 hover:bg-red-500 hover:dark:bg-red-800'
    case 'orange':
      return 'bg-orange-600 hover:bg-orange-800'
    case 'green':
      return 'bg-green-700 hover:bg-green-800'
    default:
      return ''
  }
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
    ${getColorStyles(customColor)}
  `

  return (
    <button {...rest} type={type} className={twMerge(baseStyles, className)}>
      {children}
    </button>
  )
}

export default Button
