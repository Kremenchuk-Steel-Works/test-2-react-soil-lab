import { Home, FlaskConical, Database } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useSidebar } from "./SidebarProvider"

const Sidebar: React.FC = () => {
  const { collapsed } = useSidebar()

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

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-900 shadow-md
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed ? "w-14" : "w-60"}`}
      style={{ minHeight: "100vh" }}
    >
      <nav className="flex-1">
        {items.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-2 px-4.5 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {/* Label wrapper with smooth width and opacity transition */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out flex-1\`
              ${collapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"}`}
            >
              <span className="overflow-hidden whitespace-nowrap">{label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
