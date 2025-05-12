import { User, Shield, LogOut, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { PATHS } from "../../routes/AppRoutes"
import { useAuth } from "../AuthProvider/AuthContext"
import { useSidebar } from "./SidebarProvider"

const Navbar: React.FC = () => {
  const { logout, currentUser } = useAuth()
  const { collapsed, setCollapsed } = useSidebar()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="mx-auto pr-4">
        <div className="flex items-center justify-between h-14">
          {/* Кнопка-гамбургер перед заголовком */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-4 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Логотип */}
          <div className="flex-shrink-0 pl-4">
            <Link
              to={PATHS.MAIN}
              className="text-2xl font-bold text-blue-600 dark:text-white"
            >
              Steel
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
                  {currentUser?.profile.first_name}&nbsp;
                  {currentUser?.profile.last_name}
                </span>
                <span className="inline sm:hidden">
                  {currentUser?.profile.first_name}
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
