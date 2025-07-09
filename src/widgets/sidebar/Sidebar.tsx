import React from 'react'
import { useVisibleRoutes } from '@/shared/hooks/usePermissions'
import { getFullPath } from '@/utils/path'
import MenuItem from '@/widgets/sidebar/MenuItem'
import { useSidebar } from '@/widgets/sidebar/SidebarProvider'
import { SubMenu } from '@/widgets/sidebar/SubMenu'

const Sidebar: React.FC = () => {
  const { closeSidebar, closeSubMenu, expandedSubMenus, collapsed, broken } = useSidebar()
  const visibleRoutes = useVisibleRoutes()

  const baseClasses = `
    z-50 flex flex-col bg-white dark:bg-gray-900 shadow-md transition-all duration-200 ease-in-out overflow-hidden
  `
  // При broken-mode — fixed overlay, иначе - static в потоке
  const modeClasses = broken
    ? `fixed top-14 bottom-0 left-0
       transform ${collapsed ? '-translate-x-full' : 'translate-x-0'}
       w-70`
    : `relative ${collapsed ? 'w-14' : 'w-70'}`

  return (
    <>
      {/* Бекдроп для мобильного, при клике вне области закрываем sidebar */}
      {broken && !collapsed && (
        <div className="fixed inset-0 top-14 z-40 bg-black/50" onClick={closeSidebar} />
      )}

      <aside
        className={`${baseClasses} ${modeClasses}`}
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
              .map((route) => {
                // Находим дочерние элементы, которые должны быть видимы в сайдбаре
                const visibleChildren = route.children?.filter((child) => child.inSidebar !== false)

                // Если видимые дочерние элементы есть, то рендерим SubMenu
                if (visibleChildren && visibleChildren.length > 0) {
                  return (
                    <SubMenu key={route.key} id={route.key} label={route.label} Icon={route.icon}>
                      {visibleChildren.map((child) => (
                        <MenuItem
                          key={child.key}
                          label={child.label}
                          Icon={child.icon}
                          to={getFullPath(route.path, child.path)}
                        />
                      ))}
                    </SubMenu>
                  )
                }

                // В противном случае (если children нет или все они скрыты) рендерим простой MenuItem
                return (
                  <MenuItem key={route.key} label={route.label} Icon={route.icon} to={route.path} />
                )
              })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
