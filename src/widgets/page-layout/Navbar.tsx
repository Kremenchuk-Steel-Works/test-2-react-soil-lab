import { LogOut, Menu, Shield, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth/model'
import { PATHS } from '@/app/routes/AppRoutes'
import { useSidebar } from '@/widgets/sidebar/SidebarProvider'

const Navbar: React.FC = () => {
  const { logout, currentUser } = useAuth()
  const { toggleSidebar, closeSidebar, closeSubMenu, expandedSubMenus, collapsed, broken } =
    useSidebar()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="relative z-50 bg-white shadow-md dark:bg-gray-900">
      <div className="mx-auto pr-4">
        <div
          className="flex h-14 items-center justify-between"
          onClick={() =>
            (collapsed && expandedSubMenus && closeSubMenu()) ||
            (broken && !collapsed && closeSidebar())
          }
        >
          {/* Кнопка-гамбургер перед заголовком */}
          <button
            onClick={toggleSidebar}
            className="cursor-pointer p-4 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Link
              to={PATHS.MAIN}
              className="block px-5 py-2 text-2xl font-bold text-blue-500 dark:text-white"
            >
              <img src="/cz-logo-v111.png" alt="CZ Logo" className="h-10 object-contain" />
            </Link>
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-3 pl-4 font-semibold">
            {/* Роль */}
            <div className="flex min-w-0 flex-shrink cursor-default items-center gap-1 overflow-hidden whitespace-nowrap">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{currentUser?.roles[0].name}</span>
            </div>

            {/* Имя / фамилия */}
            <div className="flex min-w-0 flex-shrink-0 cursor-default items-center gap-1 overflow-hidden whitespace-nowrap">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">{currentUser?.email}&nbsp;</span>
              </span>
            </div>

            {/* Выход */}
            <button
              onClick={handleLogout}
              className="inline-flex flex-shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap hover:text-blue-500"
            >
              <LogOut className="h-4 w-4" />
              Вихід
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
