import { Outlet } from 'react-router-dom'
import Layout from '@/widgets/page-layout/Layout'
import { PageHeader } from '@/widgets/page/PageHeader'

export default function LibraryLayout() {
  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-2">
        <PageHeader />
        <Outlet />
      </div>
    </Layout>
  )
}
