import { Outlet } from 'react-router-dom'
import MainLayout from '@/widgets/page-layout/MainLayout'

export default function AdminPanelLayoutPage() {
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col space-y-2">
        <Outlet />
      </div>
    </MainLayout>
  )
}
