import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { useSidebar } from "./SidebarProvider"
import { useIsTruncated } from "../../shared/hooks/useIsTruncated"

interface MenuItemProps {
  label: string
  Icon?: LucideIcon
  to: string
}

export default function MenuItem({ label, Icon, to }: MenuItemProps) {
  const { collapsed, broken, closeSubMenu, closeSidebar } = useSidebar()
  const { ref, isTruncated } = useIsTruncated<HTMLDivElement>()

  function handleClick() {
    // Если свернутое, закрываем сабменю
    if (collapsed) {
      closeSubMenu()
      // Если мобильная версия, закрываем сайдбар
    } else if (broken) {
      closeSidebar()
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="flex items-center gap-2 px-4.5 py-4 hover:bg-gray-200 dark:hover:bg-blue-700"
      {...(isTruncated || collapsed ? { title: label } : {})}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <div ref={ref} className={"truncate flex-shrink min-w-0 overflow-hidden"}>
        <span key={label}>{label}</span>
      </div>
    </Link>
  )
}
