import { useSidebar } from "./SidebarProvider"
import { FlaskConical, Database, Package } from "lucide-react"
import { SubMenu } from "./SubMenu"
import { SubMenuItem } from "./SubMenuItem"
import { SubMenuSubItem } from "./SubMenuISubItem"
import getAccessPages from "../../utils/accessPage"

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
        {/* обёртка для скролла */}
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
                  label={p.description}
                  Icon={Database}
                  to={`/${p.name}`}
                />
              </SubMenu>
            ))}
            {/* <SubMenu id="123" label="Analytics" Icon={FlaskConical}>
              <SubMenuItem
                label="Spectral"
                Icon={FlaskConical}
                to="/spectral_analysis"
              />
              <SubMenuItem label="Streamlit" Icon={Database} to="/streamlit" />
            </SubMenu>
            <SubMenu id="1234" label="Example" Icon={FlaskConical}>
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
              <SubMenuSubItem
                id="12345"
                label="Analytics Test"
                Icon={FlaskConical}
              >
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
                <SubMenuSubItem
                  id="123456"
                  label="Analytics"
                  Icon={FlaskConical}
                >
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
            <SubMenu id="1" label="Example" Icon={FlaskConical}>
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
              <SubMenuSubItem
                id="11"
                label="Analytics Test"
                Icon={FlaskConical}
              >
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
                <SubMenuSubItem id="111" label="Analytics" Icon={FlaskConical}>
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
                  <SubMenuSubItem
                    id="11111"
                    label="Analytics Test"
                    Icon={FlaskConical}
                  >
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
                    <SubMenuSubItem
                      id="111111"
                      label="Analytics"
                      Icon={FlaskConical}
                    >
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
                </SubMenuSubItem>
              </SubMenuSubItem>
              <SubMenuItem
                label="Спектральний аналіз"
                Icon={FlaskConical}
                to="/spectral_analysis/add"
              />
            </SubMenu> */}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
