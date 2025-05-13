import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

interface MenuItemProps {
  label: string
  Icon?: LucideIcon
  to: string
}

export default function MenuItem({ label, Icon, to }: MenuItemProps) {
  return (
    <Link
      key={label}
      to={to}
      className="flex items-center gap-2 px-4.5 py-4 hover:bg-blue-100 dark:hover:bg-blue-700"
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <div className={"overflow-hidden"}>
        <span className="whitespace-nowrap">{label}</span>
      </div>
    </Link>
  )
}
