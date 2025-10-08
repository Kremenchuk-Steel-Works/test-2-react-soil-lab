import React from 'react'
import { isNonIndexRoute } from '@/app/routes/utils/utils'
import { useVisibleRoutes } from '@/shared/hooks/usePermissions'
import { getFullPath } from '@/utils/path'
import MenuItem from '@/widgets/sidebar/MenuItem'
import { useSidebar } from '@/widgets/sidebar/sidebar-context'
import { SubMenu } from '@/widgets/sidebar/SubMenu'

const Sidebar: React.FC = () => {
  const { closeSidebar, closeSubMenu, expandedSubMenus, collapsed, broken } = useSidebar()
  const visibleRoutes = useVisibleRoutes()

  const baseClasses = `
    z-50 flex flex-col bg-white dark:bg-gray-900 shadow-md transition-all duration-200 ease-in-out
  `

  const modeClasses = broken
    ? `fixed top-14 bottom-0 left-0 transform ${collapsed ? '-translate-x-full' : 'translate-x-0'} w-70`
    : `relative ${collapsed ? 'w-14' : 'w-70'}`

  return (
    <>
      {broken && !collapsed && (
        <div className="fixed inset-0 top-14 z-40 bg-black/50" onClick={closeSidebar} />
      )}

      <aside
        className={`${baseClasses} ${modeClasses}`}
        onClick={() => {
          if (collapsed && expandedSubMenus) closeSubMenu()
        }}
      >
        {/* Скролл-обёртка: резерв под скролл + выносим его за контент */}
        <div className="-mr-[var(--sbw,8px)] flex-1 overflow-y-auto pr-[var(--sbw,0px)] pb-14 [scrollbar-gutter:stable]">
          <nav onClick={(e) => e.stopPropagation()}>
            {visibleRoutes
              .filter(isNonIndexRoute)
              .filter((route) => route.inSidebar !== false)
              .map((route) => {
                // Берём ТОЛЬКО неиндексные видимые дочерние
                const visibleChildren = route.children
                  ?.filter(isNonIndexRoute)
                  .filter((child) => child.inSidebar !== false)

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
