import { useSidebar } from "./SidebarProvider"
import type { LucideIcon } from "lucide-react"
import { FlaskConical, Database } from "lucide-react"
import MenuItem from "./MenuItem"
import { SubMenu } from "./SubMenu"
import { SubMenuItem } from "./SubMenuItem"
import { SubMenuSubItem } from "./SubMenuISubItem"

const Sidebar: React.FC = () => {
  const { collapsed, broken, closeSidebar } = useSidebar()

  const items: {
    icon: LucideIcon
    label: string
    to: string
  }[] = [
    {
      icon: FlaskConical,
      label: "Spectral AnalysisTest",
      to: "/spectral_analysis",
    },
    { icon: Database, label: "Streamlit", to: "/streamlit" },
  ]

  const baseClasses = `
    z-50 flex flex-col bg-white dark:bg-gray-900 shadow-md transition-all duration-300 ease-in-out overflow-hidden
  `

  // При broken-mode — fixed overlay, иначе — static в потоке
  const modeClasses = broken
    ? `fixed top-14 bottom-0 left-0
       transform ${collapsed ? "-translate-x-full" : "translate-x-0"}
       w-60`
    : `relative ${collapsed ? "w-14" : "w-60"}`

  return (
    <>
      {/* Бекдроп для мобильного */}
      {broken && !collapsed && (
        <div className="fixed inset-0 bg-black/50" onClick={closeSidebar} />
      )}

      <aside className={`${baseClasses} ${modeClasses}`}>
        <nav>
          {items.map(({ icon: Icon, label, to }) => (
            <MenuItem key={label} Icon={Icon} label={label} to={to} />
          ))}
          <SubMenu label="Analytics" Icon={FlaskConical}>
            <SubMenuItem
              label="Spectral"
              Icon={FlaskConical}
              to="/spectral_analysis"
            />
            <SubMenuItem label="Streamlit" Icon={Database} to="/streamlit" />
          </SubMenu>
          <SubMenu label="Example" Icon={FlaskConical}>
            <SubMenuItem
              label="Test 1"
              Icon={Database}
              to="/spectral_analysis"
            />
            <SubMenuItem
              label="Test 2"
              Icon={Database}
              to="/spectral_analysis"
            />
            <SubMenuSubItem label="Analytics Test" Icon={FlaskConical}>
              <SubMenuItem
                label="Spectral"
                Icon={FlaskConical}
                to="/spectral_analysis"
              />
              <SubMenuItem label="Streamlit" Icon={Database} to="/streamlit" />
              <SubMenuSubItem label="Analytics" Icon={FlaskConical}>
                <SubMenuItem
                  label="Spectral"
                  Icon={FlaskConical}
                  to="/spectral_analysis"
                />
                <SubMenuItem
                  label="Streamlit"
                  Icon={Database}
                  to="/streamlit"
                />
              </SubMenuSubItem>
            </SubMenuSubItem>
            <SubMenuItem
              label="Спектральний аналіз"
              Icon={FlaskConical}
              to="/spectral_analysis/add"
            />
          </SubMenu>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
