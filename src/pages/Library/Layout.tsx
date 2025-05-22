import Layout from "../../components/Template/Layout"
import { Outlet } from "react-router-dom"

export default function LibraryLayout() {
  return (
    <Layout>
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="layout-text">Бібліотека</h4>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}
