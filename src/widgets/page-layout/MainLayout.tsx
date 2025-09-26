import { usePageTitle } from '@/shared/hooks/usePageTitle'
import Navbar from '@/widgets/page-layout/Navbar'
import { PageHeader } from '@/widgets/page/PageHeader'
import Sidebar from '@/widgets/sidebar/Sidebar'

/**
 * Основной MainLayout приложения.
 * Включает в себя Navbar, Sidebar и основную контентную область.
 * Запускает хук для управления заголовком страницы.
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTitle()
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Breadcrumbs */}
          <div className="sticky top-0 z-40 min-w-0 bg-gray-50 px-4 pt-4 dark:bg-gray-800">
            <PageHeader />
          </div>

          {/* Прокручивание содержимого страницы */}
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
