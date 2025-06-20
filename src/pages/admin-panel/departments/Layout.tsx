import { Outlet } from 'react-router-dom'

export default function AdminDepartmentsLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="layout-text">Відділи</h4>
      </div>
      <Outlet />
    </div>
  )
}
