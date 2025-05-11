import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export const AlertType = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  WARNING: "WARNING",
} as const

export type AlertType = keyof typeof AlertType

type AlertMessageProps = {
  type: AlertType
  message: string
  className?: string
}

const baseStyle =
  "flex items-center gap-2 p-2.5 rounded-md text-sm border break-words whitespace-normal"

const alertConfigs: Record<
  AlertType,
  { icon: React.ReactNode; style: string }
> = {
  SUCCESS: {
    icon: (
      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
    ),
    style:
      "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
  },
  ERROR: {
    icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    style:
      "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
  },
  WARNING: {
    icon: (
      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    ),
    style:
      "bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
  },
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  className,
}) => {
  const { icon, style } = alertConfigs[type]

  return (
    <div
      className={`${baseStyle} ${style} ${className ?? ""}`}
      role="alert"
      aria-live="polite"
    >
      {icon}
      <p className="leading-snug">{message}</p>
    </div>
  )
}

export default AlertMessage
