import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs'
import Layout from '@/widgets/page-layout/Layout'

export default function MoldPassportMainLayout() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Breadcrumbs />
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}
