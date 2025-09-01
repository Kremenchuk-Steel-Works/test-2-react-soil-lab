import React, { useRef } from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { useIsTruncated } from '@/shared/hooks/useIsTruncated'
import { CollapseFM } from '@/shared/ui/animation/CollapseFM'
import Popup from '@/widgets/sidebar/Popup'
import { useSidebar } from '@/widgets/sidebar/sidebar-context'

interface SubMenuProps {
  label: string
  Icon: LucideIcon
  children: React.ReactNode
  id: string
  isMainMenu?: boolean
}

export const SubMenu: React.FC<SubMenuProps> = ({
  label,
  Icon,
  children,
  id,
  isMainMenu = true,
}) => {
  const elementId = label + id
  const { collapsed, expandedSubMenus, collapsedSubMenu, toggleSubMenu } = useSidebar()

  const isExpandedOpen = expandedSubMenus.has(elementId)
  const isCollapsedOpen = collapsedSubMenu === elementId

  // Переполняется ли текст, чтобы потом отобразить подсказку
  const { ref, isTruncated } = useIsTruncated<HTMLDivElement>()
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="sub-menu relative">
      {/* кнопка разворачивания */}
      <button
        ref={btnRef}
        onClick={() => toggleSubMenu(elementId, isMainMenu)}
        className="flex w-full cursor-pointer items-center justify-between px-4.5 py-4 hover:bg-gray-200 dark:hover:bg-blue-700"
      >
        <div
          className={`flex min-w-0 items-center gap-2`}
          {...(isTruncated || collapsed ? { title: label } : {})}
        >
          <div
            className={`transition-colors duration-200 ${
              !collapsed && isMainMenu && isExpandedOpen ? 'text-blue-600 dark:text-cyan-400' : ''
            }`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0`} />
          </div>
          <div
            ref={ref}
            className={`min-w-0 flex-shrink truncate overflow-hidden whitespace-nowrap transition-[max-width] duration-200 ease-in-out ${
              collapsed && isMainMenu ? 'max-w-0' : 'max-w-full'
            } ${isExpandedOpen ? 'font-bold' : ''}`}
          >
            {label}
          </div>
        </div>

        {/* иконки */}
        <ChevronRight
          className={`flex-shrink-0 transform transition-all duration-200 ease-in-out ${isExpandedOpen ? 'rotate-90' : 'rotate-0'} ${
            !collapsed || !isMainMenu ? 'h-5 w-5 opacity-100' : 'h-0 w-0 opacity-0'
          } `}
        />
        <span
          className={`absolute right-2 block transform rounded-full bg-current/50 transition-all duration-200 ease-in-out ${
            !collapsed || !isMainMenu ? 'h-0 w-0 opacity-0' : 'h-1.5 w-1.5 opacity-100'
          } `}
        />
      </button>

      {/* Открытие Submenu с анимацией */}
      {(!collapsed || !isMainMenu) && (
        <CollapseFM isOpen={isExpandedOpen} key={elementId}>
          <div className="bg-gray-100 dark:bg-[#0e1523] [&_a]:pl-8 [&_button]:pl-8">{children}</div>
        </CollapseFM>
      )}

      {/* Портал только для главного меню при collapsed */}
      {collapsed && isCollapsedOpen && btnRef.current && (
        <Popup btnRef={btnRef} isCollapsedOpen={isCollapsedOpen} isMainMenu={isMainMenu}>
          {React.Children.map(children, (child, idx) => (
            <div key={idx}>{child}</div>
          ))}
        </Popup>
      )}
    </div>
  )
}
