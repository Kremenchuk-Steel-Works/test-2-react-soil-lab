import Navbar from "./Navbar"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-grow p-4">{children}</main>
    </div>
  )
}

export default Layout
