import Sidebar from "../sidebar/Sidebar"
import Navbar from "./Navbar"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}

export default Layout
