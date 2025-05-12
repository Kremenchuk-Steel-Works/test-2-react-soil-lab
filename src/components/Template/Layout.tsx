import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-4 min-h-screen">{children}</main>
      </div>
    </div>
  )
}

export default Layout
