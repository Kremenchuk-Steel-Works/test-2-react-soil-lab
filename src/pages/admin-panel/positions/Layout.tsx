import { Outlet } from 'react-router-dom'

export default function AdminPositionsLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="layout-text">Посади</h4>
      </div>
      <Outlet />
    </div>
  )
}
