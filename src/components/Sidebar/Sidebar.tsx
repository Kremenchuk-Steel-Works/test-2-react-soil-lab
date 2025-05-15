import { useSidebar } from "./SidebarProvider"
import { FlaskConical, Database, Package } from "lucide-react"
import { SubMenu } from "./SubMenu"
import { SubMenuItem } from "./SubMenuItem"
import getAccessPages from "../../utils/accessPage"
import React from "react"

const Sidebar: React.FC = () => {
  const { collapsed, broken, closeSidebar } = useSidebar()
  const accessPages = getAccessPages()

  const baseClasses = `
    z-50 flex flex-col bg-white dark:bg-gray-900 shadow-md transition-all duration-300 ease-in-out overflow-hidden
  `
  // При broken-mode — fixed overlay, иначе — static в потоке
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

      <aside className={`${baseClasses} ${modeClasses} flex flex-col h-full`}>
        {/* Обёртка для скролла */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav>
            {accessPages.map((p) => (
              <SubMenuItem
                key={p.name}
                label={p.description}
                Icon={Package}
                to={`/${p.name}`}
              />
            ))}
            {accessPages.map((p) => (
              <SubMenu
                key={p.name}
                id={p.name}
                label={p.description}
                Icon={FlaskConical}
              >
                <SubMenuItem
                  key={p.name}
                  label={p.description}
                  Icon={Database}
                  to={`/${p.name}`}
                />
              </SubMenu>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
