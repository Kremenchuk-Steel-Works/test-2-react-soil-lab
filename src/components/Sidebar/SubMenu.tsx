import React, { useLayoutEffect, useRef, useState } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { useSidebar } from "./SidebarProvider"
import { createPortal } from "react-dom"
import { CollapseFM } from "../../animation/CollapseFM"

interface SubMenuProps {
  label: string
  Icon: LucideIcon
  children: React.ReactNode
  id?: string
}

export const SubMenu: React.FC<SubMenuProps> = ({
  label,
  Icon,
  children,
  id,
}) => {
  const elementId = id
    ? `${label}-${String(children)}-${id}`
    : `${label}-${String(children)}`
  console.log("SubMenu mount, id=", id)
  const { collapsed, expandedSubMenus, collapsedSubMenu, toggleSubMenu } =
    useSidebar()

  const isExpandedOpen = expandedSubMenus.has(elementId)
  const isCollapsedOpen = collapsedSubMenu === elementId

  const btnRef = useRef<HTMLButtonElement>(null)

  const [popupPos, setPopupPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  // Пересчитываем позицию ТОЛЬКО при открытии вкладки в collapsed-режиме
  useLayoutEffect(() => {
    if (collapsed && isCollapsedOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPopupPos({ top: rect.top, left: rect.right })
    }
  }, [collapsed, isCollapsedOpen])

  const Popup = ({ children }: { children: React.ReactNode }) =>
    createPortal(
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => toggleSubMenu(elementId)}
        />
        <div
          className="absolute bg-white dark:bg-gray-900 shadow-lg rounded p-2 z-50"
          style={{
            position: "fixed",
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
      {/* кнопка переключения */}
      <button
        ref={btnRef}
        onClick={() => toggleSubMenu(elementId)}
        className="w-full flex items-center justify-between px-4.5 py-4 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700"
      >
        <div className={`flex items-center gap-2`}>
          <div
            className={`transition-colors duration-300 ${
              !collapsed && isExpandedOpen
                ? "text-blue-600 dark:text-cyan-400"
                : ""
            }`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0`} />
          </div>
          <div
            className={`overflow-hidden whitespace-nowrap transition-[max-width] duration-300 ease-in-out ${
              collapsed ? "max-w-0" : "max-w-full"
            } ${isExpandedOpen ? "font-bold" : ""}`}
          >
            {label}
          </div>
        </div>

        {/* иконки */}
        {!collapsed ? (
          <ChevronRight
            className={`transform transition-transform duration-300 ease-in-out 
              ${isExpandedOpen ? "rotate-90" : "rotate-0"}
  `}
          />
        ) : (
          <span className="absolute right-2 block w-1.5 h-1.5 rounded-full bg-current" />
        )}
      </button>

      {/* Открытие Submenu с анимацией */}
      {!collapsed && (
        <CollapseFM isOpen={isExpandedOpen}>
          <div className="bg-blue-50 dark:bg-[#0e1523] [&_a]:pl-8 [&_button]:pl-8">
            {children}
          </div>
        </CollapseFM>
      )}

      {/* портал при collapsed (одно) */}
      {collapsed && isCollapsedOpen && btnRef.current && (
        <Popup>
          {React.Children.map(children, (c) => (
            <div className="py-1">{c}</div>
          ))}
        </Popup>
      )}
    </div>
  )
}
