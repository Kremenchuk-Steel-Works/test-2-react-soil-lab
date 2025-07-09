import { usePageTitle } from '@/shared/hooks/usePageTitle'
import Navbar from '@/widgets/page-layout/Navbar'
import Sidebar from '@/widgets/sidebar/Sidebar'

/**
 * Основной Layout приложения.
 * Включает в себя Navbar, Sidebar и основную контентную область.
 * Запускает хук для управления заголовком страницы.
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTitle()
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="h-full flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}

export default Layout
