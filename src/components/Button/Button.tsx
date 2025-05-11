import clsx from "clsx"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  type = "button",
  ...rest
}) => {
  const baseStyles = `
    py-2 px-4
    bg-blue-600 hover:bg-blue-700
    text-white font-semibold rounded-md
    transition cursor-pointer active:scale-95
    focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  return (
    <button {...rest} type={type} className={clsx(baseStyles, className)}>
      {children}
    </button>
  )
}

export default Button
