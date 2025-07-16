import { Outlet } from 'react-router-dom'

export default function AdminDepartmentsLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <Outlet />
    </div>
  )
}
