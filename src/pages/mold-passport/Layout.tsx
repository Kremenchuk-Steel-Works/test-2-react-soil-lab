import { Outlet } from 'react-router-dom'
import Layout from '@/widgets/page-layout/Layout'

export default function MoldPassportMainLayout() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="layout-text">Паспорт плавки</h4>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}
