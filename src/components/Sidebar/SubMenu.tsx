import React, { useLayoutEffect, useRef, useState } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { useSidebar } from "./SidebarProvider"
import { createPortal } from "react-dom"
import { CollapseFM } from "../../animation/CollapseFM"
import { useIsTruncated } from "../../hooks/useIsTruncated"

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
  const {
    collapsed,
    expandedSubMenus,
    collapsedSubMenu,
    toggleSubMenu,
    closeSubMenu,
  } = useSidebar()

  const isExpandedOpen = expandedSubMenus.has(elementId)
  const isCollapsedOpen = collapsedSubMenu === elementId

  const btnRef = useRef<HTMLButtonElement>(null)

  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  const { ref, isTruncated } = useIsTruncated<HTMLDivElement>()

  // Пересчитываем позицию ТОЛЬКО при открытии вкладки в collapsed-режиме
  useLayoutEffect(() => {
    if (collapsed && isCollapsedOpen && btnRef.current && isMainMenu) {
      const rect = btnRef.current.getBoundingClientRect()
      setPopupPos({ top: rect.top, left: rect.right })
    }
  }, [collapsed, isCollapsedOpen])

  const Popup = ({ children }: { children: React.ReactNode }) =>
    createPortal(
      <>
        {/* Клик вне элементов popup */}
        <div className="fixed inset-0 z-40" onClick={closeSubMenu} />
        <div
          className="
          fixed
          bg-blue-50 dark:bg-[#0e1523]
          shadow-lg z-40
          max-h-[50vh]  /* ограничиваем % высоты экрана */
          overflow-y-auto scrollbar-hide"
          style={{
            top: popupPos.top,
            left: popupPos.left,
          }}
        >
          {children}
        </div>
      </>,
      document.body
    )

  return (
    <div className="relative sub-menu">
      {/* кнопка разворачивания */}
      <button
        ref={btnRef}
        onClick={() => toggleSubMenu(elementId, isMainMenu)}
        className="w-full flex items-center justify-between px-4.5 py-4 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700"
      >
        <div className={`flex items-center gap-2 min-w-0`}>
          <div
            className={`transition-colors duration-300 ${
              !collapsed && isMainMenu && isExpandedOpen
                ? "text-blue-600 dark:text-cyan-400"
                : ""
            }`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0`} />
          </div>
          <div
            ref={ref}
            className={`truncate whitespace-nowrap flex-shrink min-w-0 overflow-hidden transition-[max-width] duration-300 ease-in-out ${
              collapsed && isMainMenu ? "max-w-0" : "max-w-full"
            } ${isExpandedOpen ? "font-bold" : ""}`}
            {...(isTruncated ? { title: label } : {})}
          >
            {label}
          </div>
        </div>

        {/* иконки */}
        {!collapsed || !isMainMenu ? (
          <ChevronRight
            className={`w-5 h-5 flex-shrink-0 transform transition-transform duration-300 ease-in-out 
              ${isExpandedOpen ? "rotate-90" : "rotate-0"}
  `}
          />
        ) : (
          <span className="absolute right-2 block w-1.5 h-1.5 rounded-full bg-current/50" />
        )}
      </button>

      {/* Открытие Submenu с анимацией */}
      {(!collapsed || !isMainMenu) && (
        <CollapseFM isOpen={isExpandedOpen} key={elementId}>
          <div className="bg-blue-50 dark:bg-[#0e1523] [&_a]:pl-8 [&_button]:pl-8">
            {children}
          </div>
        </CollapseFM>
      )}

      {/* Портал только для главного меню при collapsed */}
      {collapsed && isCollapsedOpen && btnRef.current && (
        <Popup>
          {React.Children.map(children, (c) => (
            <div>{c}</div>
          ))}
        </Popup>
      )}
    </div>
  )
}
