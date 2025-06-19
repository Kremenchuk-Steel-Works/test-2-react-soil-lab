import React from "react"

import { useVisibleRoutes } from "../../shared/hooks/usePermissions"
import { getFullPath } from "../../utils/path"
import { useSidebar } from "./SidebarProvider"
import MenuItem from "./MenuItem"
import { SubMenu } from "./SubMenu"

const Sidebar: React.FC = () => {
  const { closeSidebar, closeSubMenu, expandedSubMenus, collapsed, broken } =
    useSidebar()
  const visibleRoutes = useVisibleRoutes()

  const baseClasses = `
    z-50 flex flex-col bg-white dark:bg-gray-900 shadow-md transition-all duration-300 ease-in-out overflow-hidden
  `
  // При broken-mode — fixed overlay, иначе - static в потоке
  const modeClasses = broken
    ? `fixed top-14 bottom-0 left-0
       transform ${collapsed ? "-translate-x-full" : "translate-x-0"}
       w-70`
    : `relative ${collapsed ? "w-14" : "w-70"}`

  return (
    <>
      {/* Бекдроп для мобильного, при клике вне области закрываем sidebar */}
      {broken && !collapsed && (
        <div className="fixed inset-0 bg-black/50" onClick={closeSidebar} />
      )}

      <aside
        className={`${baseClasses} ${modeClasses} h-full`}
        onClick={() =>
          (collapsed && expandedSubMenus && closeSubMenu()) ||
          (broken && !collapsed && closeSidebar())
        }
      >
        {/* Обёртка для скролла */}
        <div className="flex-1 overflow-y-auto">
          <nav onClick={(e) => e.stopPropagation()}>
            {visibleRoutes
              .filter((route) => route.inSidebar !== false)
              .map((route) =>
                !route.children ? (
                  <MenuItem
                    key={route.key}
                    label={route.label}
                    Icon={route.icon}
                    to={route.path}
                  />
                ) : (
                  <SubMenu
                    key={route.key}
                    id={route.key}
                    label={route.label}
                    Icon={route.icon}
                  >
                    {route.children
                      .filter((child) => child.inSidebar !== false)
                      .map((child) => (
                        <MenuItem
                          key={child.key}
                          label={child.label}
                          Icon={child.icon}
                          to={getFullPath(route.path, child.path)}
                        ></MenuItem>
                      ))}
                  </SubMenu>
                )
              )}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
