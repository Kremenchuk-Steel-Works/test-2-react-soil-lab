import { Outlet } from 'react-router-dom'
import MainLayout from '@/widgets/page-layout/MainLayout'
import { PageHeader } from '@/widgets/page/PageHeader'

export default function soilLabLayout() {
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col space-y-2">
        <PageHeader />
        <Outlet />
      </div>
    </MainLayout>
  )
}
