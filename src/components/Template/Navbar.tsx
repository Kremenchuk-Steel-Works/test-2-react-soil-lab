import { User, Shield, LogOut, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { PATHS } from "../../routes/AppRoutes"
import { useAuth } from "../AuthProvider/AuthContext"
import { useSidebar } from "../Sidebar/SidebarProvider"

const Navbar: React.FC = () => {
  const { logout, currentUser } = useAuth()
  const {
    toggleSidebar,
    closeSidebar,
    closeSubMenu,
    expandedSubMenus,
    collapsed,
    broken,
  } = useSidebar()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="relative z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="mx-auto pr-4">
        <div
          className="flex items-center justify-between h-14"
          onClick={() =>
            (collapsed && expandedSubMenus && closeSubMenu()) ||
            (broken && !collapsed && closeSidebar())
          }
        >
          {/* Кнопка-гамбургер перед заголовком */}
          <button
            onClick={toggleSidebar}
            className="p-4 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Link
              to={PATHS.MAIN}
              className="block px-5 py-2 text-2xl font-bold text-blue-500 dark:text-white"
            >
              <img
                src="/cz-logo-v111.png"
                alt="CZ Logo"
                className="h-10 object-contain"
              />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3 pl-4 min-w-0 font-semibold">
            {/* Роль */}
            <div className="flex items-center gap-1 min-w-0 flex-shrink overflow-hidden whitespace-nowrap cursor-default">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{currentUser?.roles[0].name}</span>
            </div>

            {/* Имя / фамилия */}
            <div className="flex items-center gap-1 min-w-0 flex-shrink-0 overflow-hidden whitespace-nowrap cursor-default">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">
                  {currentUser?.email}&nbsp;
                </span>
              </span>
            </div>

            {/* Выход */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 flex-shrink-0 hover:text-blue-500 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              Вихід
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
