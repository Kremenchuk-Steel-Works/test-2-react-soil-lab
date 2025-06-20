import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useIsTruncated } from '@/shared/hooks/useIsTruncated'
import { useSidebar } from '@/widgets/sidebar/SidebarProvider'

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
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <div ref={ref} className={'min-w-0 flex-shrink truncate overflow-hidden'}>
        <span key={label}>{label}</span>
      </div>
    </Link>
  )
}
