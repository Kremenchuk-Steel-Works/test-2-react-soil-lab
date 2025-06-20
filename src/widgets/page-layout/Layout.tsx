import Navbar from '@/widgets/page-layout/Navbar'
import Sidebar from '@/widgets/sidebar/Sidebar'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
