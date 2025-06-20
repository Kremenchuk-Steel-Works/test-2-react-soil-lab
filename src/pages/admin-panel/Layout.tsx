import Layout from '@/widgets/page-layout/Layout'
import { Outlet } from "react-router-dom"

export default function AdminPanelLayout() {
  return (
    <Layout>
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="layout-text">Адмін панель</h4>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}
