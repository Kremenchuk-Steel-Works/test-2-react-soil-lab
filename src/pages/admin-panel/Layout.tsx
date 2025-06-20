import { Outlet } from 'react-router-dom'
import Layout from '@/widgets/page-layout/Layout'

export default function AdminPanelLayout() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="layout-text">Адмін панель</h4>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}
