import { Outlet } from "react-router-dom"

export default function AdminPermissionsLayout() {
  return (
    <div className="flex flex-col flex-1 space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="layout-text">Права доступу</h4>
      </div>
      <Outlet />
    </div>
  )
}
